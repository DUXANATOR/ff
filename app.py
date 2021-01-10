from flask import Flask, render_template, request, send_from_directory
import os
from models.models import (registration_c, login_u, login_emp,
    get_auctions, auction_info, additem, user_bets, user_items,
    addbet, seller_items, auc_open, typeslots, update_auctions,
    moder_aucs, chely)


app = Flask(__name__)


@app.route('/')
def index():
    return render_template("index.html")


# вход на панель админов
@app.route('/admin')
def admin_panel():
    return render_template('admin_panel_login.html')


# обработчик 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


# Регистрация пользователя
@app.route('/reg_user', methods=['GET'])
def reg_customer():
    try:
        u_name = request.args['u_name']
        gender = request.args['gender']
        birthday = request.args['birthday']
        phone = request.args['phone']
        login = request.args['login']
        password = request.args['password']
        return registration_c(u_name, gender, birthday, phone, login, password)
    except Exception as e:
        print(e)
        return 'error'


# Вход юзера
@app.route('/log_u', methods=['GET'])
def c_log():
    try:
        login = request.args['login']
        password = request.args['password']
        return login_u(login, password)
    except Exception as e:
        print(e)
        return 'error'


# Вход работника
@app.route('/log_emp', methods=['GET'])
def emp_log():
    try:
        login = request.args['login']
        password = request.args['password']
        return login_emp(login, password)
    except Exception as e:
        print(e)
        return 'error'


# Получение списка аукционов
@app.route('/db_get_auctions', methods=['GET'])
def get_aucs():
    try:
        return get_auctions()
    except Exception as e:
        print(e)
        return 'error'


# Получение списка товаров аукциона
@app.route('/db_get_auction_info', methods=['GET'])
def get_auc_info():
    try:
        aid = request.args['auction_id']
        return auction_info(aid)
    except Exception as e:
        print(e)
        return 'error'


# Добавление предмета
@app.route('/add_item', methods=['GET'])
def item_add():
    try:
        seller_login = request.args['seller_login']
        item_name = request.args['item_name']
        item_desc = request.args['item_desc']
        photo = request.args['photos']
        itype = request.args['itype']
        price = request.args['price']
        
        return additem(seller_login, item_name, item_desc, photo, itype, price)
    except Exception as e:
        print(e)
        return 'error'


# Получение ставок пользователя
@app.route('/my_bets', methods=['GET'])
def get_bet_info():
    try:
        user_login = request.args['login_user']
        return user_bets(user_login)
    except Exception as e:
        print(e)
        return 'error'


# Получение выигрышей пользователя
@app.route('/my_wins', methods=['GET'])
def get_user_items_info():
    try:
        user_login = request.args['login_user']
        return user_items(user_login)
    except Exception as e:
        print(e)
        return 'error'


# Добавление ставок пользователя
@app.route('/buylot', methods=['GET'])
def add_bet():
    try:
        user_login = request.args['login_user']
        id_item = request.args['lot']
        new_price = request.args['price']
        addbet(user_login, id_item, new_price)
        return 'success'
    except Exception as e:
        print(e)
        return 'error'


# Получение предметов продавца
@app.route('/my_lots', methods=['GET'])
def get_seller_items():
    try:
        user_login = request.args['login_user']
        return seller_items(user_login)
    except Exception as e:
        print(e)
        return 'error'


# открытие аукциона
@app.route('/upd_auctions', methods=['GET'])
def auc_upd():
    try:
        id_auction = request.args['id_auction']
        return auc_open(id_auction)
    except Exception as e:
        print(e)
        return 'error'    
        

# типы предметов
@app.route('/lot_type', methods=['GET'])
def lottype_db():
    try:
        return typeslots()
    except Exception as e:
        print(e)
        return 'error'  


# обновление аукционов
@app.route('/update', methods=['GET'])
def updatee():
    try:
        update_auctions()
        return 'success'
    except Exception as e:
        print(e)
        return 'error'  


# аукционы модера
@app.route('/moder_auctions', methods=['GET'])
def moder_aucss():
    try:
        login = request.args['login']
        return moder_aucs(login)
    except Exception as e:
        print(e)
        return 'error'


# продавцы
@app.route('/seller', methods=['GET'])
def chelyki():
    try:
        return chely()
    except Exception as e:
        print(e)
        return 'error'


if __name__ == "__main__":
    app.run(debug=True, host='26.173.145.160', port='80')
