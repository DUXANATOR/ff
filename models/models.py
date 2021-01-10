import pypyodbc
import json
import time
from random import randint

connection = pypyodbc.connect('Driver={SQL Server};Server=127.0.01;Database=auctions;uid=adminn;pwd=1111')
cursor = connection.cursor()


# Функция на получение данных из БД
def cursorget(query):
    cursor.execute(query)
    results = cursor.fetchall()
    return results

# конвертирование в json
def conv_to_json(some_tuple):
    results = json.dumps(some_tuple, ensure_ascii=False, separators=(',', ': '))
    return results


# Регистрация
def registration_c(c_name, gender, birthday, phone, login, password):
    login_list = cursorget("select lower(login) from users ")
    similar_login_check = False

    for item in login_list:
        for subitem in item:
            if login == subitem:
                similar_login_check = True
                break
        else:
            continue
        break

    if similar_login_check == True:
        return 'fail'
    else:
        cursor.execute(
            "insert into auctions.dbo.users (u_name,gender,birthday,phone,login,password)"
	        "values ('%s','%s', cast('%s' as date),'%s','%s','%s')"
            % (c_name, gender, birthday, phone, login, password)
            )
        cursor.commit()
        return 'success'


# Вход работника
def login_emp(login, password):
    logins = cursorget("select lower(login), password from admins")
    check = False
    for item in logins: # проверка логина и пароля
        if login == item[0] and password == item[1]:
            check = True

    if check == True:
        return cursorget(
            "select rolename from admins a "
            "join roles r on a.id_role = r.id_role "
            "where a.login = '%s'" % login)[0][0]
    else:
        return 'fail'


# Вход покупателя/продавца
def login_u(login, password):
    logins = cursorget("select lower(login), password from users")
    check = False

    for item in logins:
        if login == item[0] and password == item[1]:
            check = True

    if check == True:
        return 'success'
    else:
        return 'fail'
        

# Информация об аукционах
def get_auctions():
    return conv_to_json(cursorget(
        "select a.id_auction, it.tname, a.date_start, a.date_end from auctions a "
        "join item_types it on it.id_type = a.id_type "
        "where lower(a.status) = 'активен'"
    ))


# Инфа об одном аукционе
def auction_info(a_id):
    return conv_to_json(cursorget(
        "select i.id_item, i.item_name, i.description, i.photo, "
        "CASE WHEN x.price IS NOT NULL THEN x.price "
        "else i.start_price "
        "end price, s.u_name  "
        "from item i "
        "join users s on s.id_user = i.id_seller "
        "left join (select max(b2.new_price) price, b2.id_item from bet b2 "
        "   group by id_item) x on x.id_item = i.id_item "
        "where i.id_type = %i" % int(a_id)
    ))


# "мои покупки" для пользователя N
def user_items(user_login):
    customer_id = cursorget(
        "select id_user from users "
        "where login = '%s' " % user_login
    )[0][0]

    return conv_to_json(cursorget(
        "select i.item_name, i.description, i.photo, is2.price, s.u_name, is2.sell_date "
        "from item_sell is2 "
        "join bet b on b.id_bet = is2.id_lot "
        "join item i on i.id_item = b.id_item "
        "join users s on s.id_user = i.id_seller "
        "join users c on c.id_user = b.id_customer "
        "where c.id_user = %i" % int(customer_id)
    ))


# "мои ставки" для пользователя N
def user_bets(user_login):
    customer_id = cursorget(
        "select id_user from users "
        "where login = '%s' " % user_login
    )[0][0]

    
    return conv_to_json(cursorget("select i2.id_item, i2.item_name, i2.description, i2.photo, b.new_price, x.aa "
        "from bet b "
        "join users c on c.id_user = b.id_customer "
        "join item i2 on i2.id_item = b.id_item "
        " left join (select max(b2.new_price) aa, b2.id_item from bet b2 group by b2.id_item) x on x.id_item = i2.id_item "
        "where c.id_user = %i" % int(customer_id)))


# добавление предмета
def additem(seller_login, item_name, item_desc, photo, itype, price):
    cursor.execute(
        "select id_user from users "
        "where login = '%s' " % seller_login
    )
    seller_id = cursor.fetchall()[0][0]

    cursor.execute("select it.id_type from item_types it where it.tname = '%s'" % itype)
    itype = cursor.fetchall()[0][0]
    cursor.execute(
        "insert into item(id_seller, item_name, description, photo, sold, id_type, start_price) "
        "values(%i, '%s', '%s', '%s', 0, %i, %i)" % (int(seller_id), item_name, item_desc, photo, int(itype), int(price))
    )
    cursor.commit()
    return 'success'


# "мои предметы" для продавца
def seller_items(seller_login):
    seller_id = cursorget(
        "select id_user from users "
        "where login = '%s' " % seller_login
    )[0][0]

    return conv_to_json(cursorget(
        "select i.id_item, i.item_name, i.description, i.photo, "
        "case when sold = 0 and b.new_price is not null then b.new_price "
            "when sold = 0 and b.new_price is null then i.start_price "
            "when sold = 1 then is2.price end price, "
        "case when i.sold = 1 then 'Да' else 'Нет' end bought "
        "from users u "
        "join item i on u.id_user = i.id_seller "
        "left join bet b on b.id_bet = (select max(id_bet) from bet b2 where b2.id_item = i.id_item) "
        "left join item_sell is2 on is2.id_lot = b.id_bet "
        "where u.id_user = %i" % seller_id
    ))


#  добавление ставки
def addbet(user_login, id_item, new_price):
    customer_id = cursorget(
        "select id_user from users "
        "where login = '%s' " % user_login
    )[0][0]

    cursor.execute("insert into auctions.dbo.bet (id_customer,id_item,new_price,bet_date) "
	"values ( %i, %i, %i, sysdatetimeoffset()) " % (int(customer_id), int(id_item), int(new_price)))
    cursor.commit()


# обновление выигрышей и закрытие аукционов
def reload():
    sqldate = cursorget("select cast(sysdatetimeoffset() as date)")[0][0]
    print(sqldate)


# открытие аукционов
def auc_open(id_auction):
    cursor.execute(
       " update auctions set status = 'Активен'"
       " where id_auction = %i"
        " update auctions set date_start = cast(SYSDATETIMEOFFSET() as date)  "
       " where id_auction = %i"
        " update auctions set date_end = dateadd(dd, 7, cast(SYSDATETIMEOFFSET() as date)) "
       " where id_auction = %i" % (int(id_auction), int(id_auction), int(id_auction))
    )
    cursor.commit()
    return 'success'


# типы предметов
def typeslots():
    return conv_to_json(cursorget("select it.tname, it.id_type from item_types it "))


# обновление аукционов
def update_auctions():
    cursor.execute(
        "update auctions "
        "set status = 'Неактивен' "
        "where lower(status) = 'активен' and date_end = cast(SYSDATETIMEOFFSET() as date)"
    )


# аукционы для модератора
def moder_aucs(login):
    role = cursorget("select rolename "
    "from admins a "
    "join roles r on a.id_role = r.id_role "
    "where a.login = '%s'" % login)[0][0]

    if role == 'Модератор аукциона':
        return conv_to_json(cursorget(
            "select a.id_auction, it.tname, a.date_start, a.date_end, a.status from auctions a "
            "join item_types it on it.id_type = a.id_type "
            "join admins a2 on a2.id_employee = a.moder_id "
            "where a2.login = '%s'" % login
        ))
    else:
        return conv_to_json(cursorget(
            "select a.id_auction, it.tname, a.date_start, a.date_end, a.status from auctions a "
            "join item_types it on it.id_type = a.id_type "))


# список челов
def chely():
    return conv_to_json(cursorget(
        "select login, u_name from users"
    ))
