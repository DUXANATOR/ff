/*обновление информации об аукционах на сервере*/ 
window.onload = function() {
    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/update",
            data:'updateRESULTS'
            });
        }
        $up=ajaxRequest();
        $up
        .done(function(data){
        });
}
/*кнопки входа и регистрации в главном меню*/ 
function uReg(){
    document.getElementById("LoginPage").style.width = "100%";
    SwitchMenu('regWindow');
}

function uLogin(){
    document.getElementById("LoginPage").style.width = "100%";
    SwitchMenu('loginWindow');
}
  
function SwitchMenu(temp){
    var tabcontent= document.getElementsByClassName('user_enteres_blocks');
    for (let i=0; i<tabcontent.length; i++){
        tabcontent[i].style.display='none';
    }
    document.getElementById(temp).style.display='block';
}
  
/*закрытие модальных окон*/
function closeOver(){
    document.getElementById("LoginPage").style.width = "0%";
}
function closeBuyLot(){
    document.getElementById("BuyLot").style.width = "0%";
}
function closePhoto(){
    document.getElementById("PhotoOfLot").style.width = "0%";
}

let login_user='';

/*вход и регистрация*/
function reg(){
    let login, password, u_name, gender, birthday, phone;
    login=document.getElementById('login_reg').value;
    password=document.getElementById("password_reg").value;
    u_name=document.getElementById("fio_reg").value;
    let n= document.getElementById('sex_reg').options.selectedIndex;
    gender=document.getElementById('sex_reg').options[n].value;
    birthday =document.getElementById("birthday_reg").value;
    phone=document.getElementById("tel_reg").value;
    if((login=='')||(password=='')||(birthday=='')||(phone=='')||(u_name =='')){
      content=document.getElementsByClassName('war');
      for (let i=0; i<content.length; i++){
        content[i].style.border='1px solid red';
      }
      document.getElementById('warningRegMessage').innerHTML="<div class='alert alert-danger col-12'><strong>Упс...</strong>Проверьте правильность ввода</div>";
    }else{
      content=document.getElementsByClassName('war');
      for (let i=0; i<content.length; i++){
        content[i].style.border='1px solid #ced4da';
        document.getElementById('warningRegMessage').innerHTML="";
      }
      function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/reg_user",
            data:{u_name, gender, birthday, phone, login, password}
            });
        }
        $reg=ajaxRequest();
        $reg
        .done(function(data){
          let regData=data;
          if (regData=='fail'){
            document.getElementById('warningRegMessage').innerHTML="<div class='alert alert-danger col-12'><strong>Упс...</strong>Данный логин уже существует</div>";
          }else{
            setTimeout(log, 100, login, password);    
          }
        });    
    }
}

function log(uLog, uPas){
  let login, password;
  if(uLog==''||uPas==''){
    login=document.getElementById("login-input").value;
    password=document.getElementById("password-input").value;
  }else{
    login=uLog;
    password=uPas;
  }
  if ((login!='')&&(password!='')){
    document.getElementById('warningLogMessage').innerHTML="";
    content=document.getElementsByClassName('warLog');
    for (let i=0; i<content.length; i++){
      content[i].style.border='1px solid #ced4da';
    }

    function ajaxRequest(){
      return $.ajax({
          type:"GET",
          url:"/log_u",
          data:{login, password}
          });
      }
      $log=ajaxRequest();
      $log
      .done(function(data){
        let logData=data;
        if (logData=='wrong'){
          document.getElementById('warningLogMessage').innerHTML="<div class='alert alert-danger col-12'><strong>Упс...</strong>Неверный логин или пароль</div>";
        }else{
         login_user=login;
         closeOver();
         content=document.getElementsByClassName('OnDelete');
         for(i=0; i<content.length; i++){
             content[i].style.display='none';
         }

         var ele=document.createElement("li");
         ele.setAttribute("class",'nav-item');
         $('#onUpdate').append(ele);
         html_str1="<a class='nav-link' href='#user_bets'>История ставок</a>";
         ele.innerHTML=html_str1;

         ele=document.createElement("li");
         ele.setAttribute("class",'nav-item');
         $('#onUpdate').append(ele);

         html_str1="<a class='nav-link' href='#user_wins'>Выиграные ставки</a>";

         ele.innerHTML=html_str1;

         ele=document.createElement("li");
         ele.setAttribute("class",'nav-item');
         $('#onUpdate').append(ele);
         html_str1="<a class='nav-link' href='#user_lots'>Мои продажи</a>";
         ele.innerHTML=html_str1;
         
         elem=document.getElementsByClassName('message');
         for (let i=0; i<elem.length; i++){
            elem[i].style.display='none';
         }
         myBet();
         myWins();
         addLot();
         myLots();
        }
      });
  }else{
    document.getElementById('warningLogMessage').innerHTML="<div class='alert alert-danger col-12'><strong>Упс...</strong>Проверьте правильность ввода</div>";
    content=document.getElementsByClassName('warLog');
    for (let i=0; i<content.length; i++){
      content[i].style.border='1px solid red';
    }
  }
}
/*Функции перехода пользователя*/
function openAu(){
    $(window).scrollTop($('#all_auctions').offset().top);
}

function openSe(){
    $(window).scrollTop($('#sell_wind').offset().top);
}

/*функции открытия списка аукцинов*/
function showAuct(){
    document.getElementById('Auctions_button_page').style.display='none';
    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/db_get_auctions",
            data:'all_auctions'
            });
        }
        $au=ajaxRequest();
        $au
        .done(function(data){
            auctData=JSON.parse(data);
            for(i=0; i<auctData.length; i++){
                var parent_el = document.getElementById('dinamic_auctions');
                html_str1='';
                html_str1+="<div class='row cardList' id='ONav"+auctData[i][0]+"'>";

                html_str1+="<div class='col-12 mb-4 ON"+auctData[i][0]+"'>";
                html_str1+="<div class='h3 font-weight-bold'>Тип аукциона:"+auctData[i][1]+"</div>";
                html_str1+="<div class='h5 font-weight-bold'>Номер аукциона:"+auctData[i][0]+"</div>";
                html_str1+="</div>";

                html_str1+="<div class='col-12 mb-4 ON"+auctData[i][0]+"'>";
                html_str1+="<span class='h5 font-weight-bold'>Дата&nbsp;начала</span><span class='h4 font-weight-bold'>&nbsp;"+auctData[i][2]+"</span>";
                html_str1+="</div>";

                html_str1+="<div class='col-12 mb-4 ON"+auctData[i][0]+"'>";
                html_str1+="<span class='h5 font-weight-bold'>Дата&nbsp;окончания</span><span class='h4 font-weight-bold'>&nbsp;"+auctData[i][3]+"</span>";
                html_str1+="</div>";

                html_str1+="<div class='col-12 mb-4 ON"+auctData[i][0]+"'>";
                html_str1+="<button type='button' class='btn btn-opt' onclick='ListG(this)' id='"+auctData[i][0]+"'>";
                html_str1+="<span class='h5 font-weight-bold'>Открыть</span>";
                html_str1+="</button>";
                html_str1+="</div>";
                
                html_str1+="</div>";
                var ele=document.createElement("div");
                ele.setAttribute("class",'col-12 col-md-6 col-xl-4 ThAuction');
                ele.setAttribute("id",""+auctData[i][0]+"ID");
                parent_el.appendChild(ele).innerHTML = html_str1;
            }
        });
}

auction_id='';

/*подробнее об аукционе, список лотов*/ 
function ListG(elem){

    auction_id=elem.id;
    document.getElementById(auction_id+'ID').classList.remove("col-md-6","col-xl-4");
    content=document.getElementsByClassName('ON'+auction_id);
    for (i=0; i<content.length; i++){
        content[i].style.display='none';
    }

    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/db_get_auction_info",
            data: {'auction_id': auction_id}
            });
        }
        
        $ai=ajaxRequest();
        $ai
        .done(function(data){
            console.log(data);
            aucInf=JSON.parse(data);
            html_str1='';
            html_str1+="<div class='col-12 h3 font-weight-bold CL"+auction_id+"'>Аукцион номер:"+auction_id+"</div>";
            html_str1+="<div class='col-12 CL"+auction_id+"'>";
            for(i=0; i<aucInf.length; i++){

                html_str1+="<div class='row'>";

                html_str1+="<div class=' col-md-4 col-6'>";
                    html_str1+="<div class='row text-center'>";
                        html_str1+="<div class='col-12'>Номер лота</div>";
                        html_str1+="<div class='col-12'>"+aucInf[i][0]+"</div>";
                    html_str1+="</div>";
                html_str1+="</div>";

                html_str1+="<div class='col-md-4 col-6'>";
                    html_str1+="<div class='row text-center'>";
                        html_str1+="<div class='col-12'>Название</div>";
                        html_str1+="<div class='col-12'>"+aucInf[i][1]+"</div>";
                    html_str1+="</div>";
                html_str1+="</div>";

                html_str1+="<div class='col-md-4 col-6'>";
                    html_str1+="<div class='row text-center'>";
                        html_str1+="<div class='col-12'>Описание</div>";
                        html_str1+="<div class='col-12'>"+aucInf[i][2]+"</div>";
                    html_str1+="</div>";
                html_str1+="</div>";

                html_str1+="<div class='col-md-4 col-6'>";
                    html_str1+="<div class='row text-center'>";
                        html_str1+="<div class='col-12'>Фото</div>";
                        html_str1+="<div class='col-12'><buttton class='btn btn-fake' onclick='photo(this)' id='"+aucInf[i][3]+"'>открыть</buttton></div>";
                    html_str1+="</div>";
                html_str1+="</div>";

                html_str1+="<div class='col-md-4 col-6'>";
                    html_str1+="<div class='row text-center'>";
                        html_str1+="<div class='col-12'>Стоимость</div>";
                        html_str1+="<div class='col-12'>"+aucInf[i][4]+"</div>";
                    html_str1+="</div>";
                html_str1+="</div>";

                html_str1+="<div class='col-md-4 col-6'>";
                    html_str1+="<div class='row text-center'>";
                        html_str1+="<div class='col-12'>Продавец</div>";
                        html_str1+="<div class='col-12'>"+aucInf[i][5]+"</div>";
                    html_str1+="</div>";
                html_str1+="</div>";

                html_str1+="<div class='col-12'>";
                    html_str1+="<div class='row text-center'>";
                        html_str1+="<div class='col-12'><button class='btn btn-opt' onclick='Buy(this)' id='"+aucInf[i][0]+';'+aucInf[i][4]+"'>Поднять цену</button></div>";
                    html_str1+="</div>";
                html_str1+="</div>";

                html_str1+="</div>";
            }
            html_str1+="</div>";
            document.getElementById('ONav'+auction_id).innerHTML=html_str1;
        });
}

/*функция оплаты*/
    function Buy(elem){
        if(login_user!=''){
            document.getElementById('BuyLot').style.width='100%';
            tempBuy=elem.id.split(';');
            html_str1='';
            html_str1+="<div class='row'>";
            html_str1+="<div class='col-12'>Лот №"+tempBuy[0]+"</div>";
            html_str1+="<div class='col-12'>Текущая стоимость:"+tempBuy[1]+"</div>";
            html_str1+="<div class='col-12'>";
            html_str1+="<label for='customRange2'>Поднять на</label>";
            html_str1+="<input type='number' class='form-control' id='customRange2'></input>";
            html_str1+="</div>";
            html_str1+="<div class='col-12'><button class='btn btn-opt' onclick='BTS(this)' id='"+tempBuy[0]+";"+tempBuy[1]+"'>ОК</button></div>";
            html_str1+="</div>";
            document.getElementById('buywindow').innerHTML=html_str1;
        }else{
            alert('Для покупки необходима авторизация!');
            uLogin();
        }
        
    }
    /*BTS-BuyToServer*/
    function BTS(elem){
        lottemp=elem.id;
        priceArr=lottemp.split(';');
        lot=priceArr[0];
        price=Number(document.getElementById('customRange2').value)+Number(priceArr[1]);
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/buylot",
                data: {login_user, lot, price}
                });
            }
            $bs=ajaxRequest();
            $bs
            .done(function(data){
                if (data=='success'){
                    alert('Успешно!');
                    closeBuyLot();
                    showBets();
                }
            });
    }

/*открыть фото*/
    function photo(elem){
        document.getElementById('PhotoOfLot').style.width='100%';
        devWidth=document.documentElement.clientWidth;
        if (devWidth>1200){
            devWidth=devWidth*0.6;
        }else{
            devWidth=devWidth*0.8;
        }
        document.getElementById('lotph').innerHTML="<img src="+elem.id+" class='image' width='"+devWidth+"'/>";
    }

function myBet(){
    html_str1='';
    html_str1+="<div class='row text-center' id='dinamic_bets'>";
    html_str1+="<div class='col-12' id='bets_button_page'>";
    html_str1+="<button class='btn btn-opt' onclick='showBets()'>Мои ставки</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    var ele=document.createElement('div');
    ele.setAttribute("class",'container-fluid');
    ele.setAttribute("id",'user_bets');
    document.getElementById("index").appendChild(ele).innerHTML=html_str1;
}
    function showBets(){
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/my_bets",
                data: {login_user}
                });
            }
            $mb=ajaxRequest();
            $mb
            .done(function(data){
                let mBetData=JSON.parse(data);
                html_str1='';
                html_str1+="<div class='col-12 h3' id='bets_data_page'>";
                html_str1+="Ваши ставки"
                html_str1+="</div>";
                html_str1+="<div class='col-12'>";
                for (i=0; i<mBetData.length; i++){
                    html_str1+="<div class='row'>";

                    html_str1+="<div class=' col-md-4 col-6'>";
                    html_str1+="<div class='row text-center'>";
                        html_str1+="<div class='col-12'>Номер лота</div>";
                        html_str1+="<div class='col-12'>"+mBetData[i][0]+"</div>";
                    html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Название</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][1]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Описание</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][2]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Фото</div>";
                            html_str1+="<div class='col-12'><buttton class='btn btn-fake' onclick='photo(this)' id='"+mBetData[i][3]+"'>открыть</buttton></div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Ваша ставка</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][4]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Текущая стоимость</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][5]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-12'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'><button class='btn btn-opt' onclick='Buy(this)' id='"+mBetData[i][0]+';'+mBetData[i][4]+"'>Поднять цену</button></div>";
                        html_str1+="</div>";
                    html_str1+="</div>";
                
                html_str1+="</div>";
                }
                html_str1+="</div>";
                document.getElementById('dinamic_bets').innerHTML=html_str1;
            });
    }

function myWins(){
    html_str1='';
    html_str1+="<div class='row text-center' id='dinamic_wins'>";
    html_str1+="<div class='col-12' id='wins_button_page'>";
    html_str1+="<button class='btn btn-opt' onclick='showWins()'>Мои выигрыши</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    var ele=document.createElement('div');
    ele.setAttribute("class",'container-fluid');
    ele.setAttribute("id",'user_wins');
    document.getElementById("index").appendChild(ele).innerHTML=html_str1;
}
    function showWins(){
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/my_wins",
                data: {login_user}
                });
            }
            $mb=ajaxRequest();
            $mb
            .done(function(data){
                let mBetData=JSON.parse(data);
                html_str1='';
                html_str1+="<div class='col-12 h3' id='bets_data_page'>";
                html_str1+="Ваши выигрыши"
                html_str1+="</div>";
                html_str1+="<div class='col-12'>";
                for (i=0; i<mBetData.length; i++){
                html_str1+="<div class='row'>";

                    html_str1+="<div class=' col-md-4 col-6'>";
                    html_str1+="<div class='row text-center'>";
                        html_str1+="<div class='col-12'>Номер лота</div>";
                        html_str1+="<div class='col-12'>"+mBetData[i][0]+"</div>";
                    html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Название</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][1]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Описание</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][2]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Фото</div>";
                            html_str1+="<div class='col-12'><buttton class='btn btn-fake' onclick='photo(this)' id='"+mBetData[i][3]+"'>открыть</buttton></div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Стоимость</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][4]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Продавец</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][5]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";
                
                html_str1+="</div>";
                }
                html_str1+="</div>";
                document.getElementById('dinamic_wins').innerHTML=html_str1;
            });
    }

function addLot(){
    html_str1='';
    html_str1+="<div class='row text-center' id='sell_wind'>";
    html_str1+="<div class='col-12' id='lots_button_page'>";
    html_str1+="<button class='btn btn-opt' onclick='show_addlots()'>Выставить лот</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    var ele=document.createElement('div');
    ele.setAttribute("class",'container-fluid');
    ele.setAttribute("id",'add_lots');
    document.getElementById("index").appendChild(ele).innerHTML=html_str1;
}
    function show_addlots(){
        html_str1='';
        html_str1+="<div class='col-12 h3'>Добавить Лот</div>";
        html_str1+="<div class='col-12'>";
        html_str1+="<form>";
        html_str1+="<span class='bodyItem'>Тип&nbsp;Лота</span>";
        html_str1+="<select id='type_lot' class='form-control mb-2'>";
        html_str1+="</select>";

        html_str1+="<span class='bodyItem'>Название&nbsp;лота</span>";
        html_str1+="<input class='form-control' type='text' placeholder='Название' id='lot-name'>";

        html_str1+="<span class='bodyItem'>Описание&nbsp;лота</span>";
        html_str1+="<input class='form-control' type='text' placeholder='Описание' id='lot-desc'>";

        html_str1+="<span class='bodyItem'>Цена&nbsp;лота</span>";
        html_str1+="<input class='form-control' type='number' placeholder='цена' id='lot-price'>";

        html_str1+="<span class='bodyItem'>Фото&nbsp;лота</span>";
        html_str1+="<input class='form-control' type='text' placeholder='url' id='lot-url'>";

        html_str1+="</form>";
        html_str1+="</div>";
        html_str1+="<div class='col-12'>";
        html_str1+="<button class='ent-btn btn mb-4' onclick='LotToServer()'>Добавить</button>";
        html_str1+="</div>";
        document.getElementById('sell_wind').innerHTML=html_str1;
        addlots_select();
    }

        function addlots_select(){
            function ajaxRequest(){
                return $.ajax({
                    type:"GET",
                    url:"/lot_type",
                    data:'updateRESULTS'
                    });
                }
                $lt=ajaxRequest();
                $lt
                .done(function(data){
                    lotTypeData=JSON.parse(data);
                    content=document.getElementById('type_lot');
                    html_str1='';
                    for(i=0; i<lotTypeData.length; i++){
                        html_str1+="<option value='"+lotTypeData[i][0]+"'>"+lotTypeData[i][0]+"</option>";
                    }
                    content.innerHTML=html_str1;
                });
        }

        function LotToServer(){
           let seller_login, item_name, item_desc, photos, itype, price;
           seller_login=login_user;
           item_name=document.getElementById('lot-name').value;
           item_desc=document.getElementById('lot-desc').value;
           photos=document.getElementById('lot-url').value;
           price=document.getElementById('lot-price').value;
           let n=document.getElementById('type_lot').options.selectedIndex;
           itype=document.getElementById('type_lot').options[n].value;
           if((item_name=='')||(item_desc=='')||(photos=='')||(price=='')||(itype =='')){
                alert('все данные должны быть заполнены');
           }else{
            function ajaxRequest(){
                return $.ajax({
                    type:"GET",
                    url:"/add_item",
                    data:{seller_login, item_name, item_desc, photos, itype, price}
                    });
                }
                $adi=ajaxRequest();
                $adi
                .done(function(data){
                    if (data=='success'){
                        alert('успешно');
                        show_addlots();
                        showMyLots();
                    }
                });
           }
        }

function myLots(){
    html_str1='';
    html_str1+="<div class='row text-center' id='dinamic_Mylots'>";
    html_str1+="<div class='col-12' id='Mylots_button_page'>";
    html_str1+="<button class='btn btn-opt' onclick='showMyLots()'>Мои лоты</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    var ele=document.createElement('div');
    ele.setAttribute("class",'container-fluid');
    ele.setAttribute("id",'user_lots');
    document.getElementById("index").appendChild(ele).innerHTML=html_str1;
}
    function showMyLots(){
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/my_lots",
                data: {login_user}
                });
            }
            $mb=ajaxRequest();
            $mb
            .done(function(data){
                let mBetData=JSON.parse(data);
                html_str1='';
                html_str1+="<div class='col-12 h3' id='dinamic_Mylots'>";
                html_str1+="Ваши лоты"
                html_str1+="</div>";
                html_str1+="<div class='col-12'>";
                for (i=0; i<mBetData.length; i++){
                html_str1+="<div class='row'>";

                    html_str1+="<div class=' col-md-4 col-6'>";
                    html_str1+="<div class='row text-center'>";
                        html_str1+="<div class='col-12'>Номер лота</div>";
                        html_str1+="<div class='col-12'>"+mBetData[i][0]+"</div>";
                    html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Название</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][1]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Описание</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][2]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Фото</div>";
                            html_str1+="<div class='col-12'><buttton class='btn btn-fake' onclick='photo(this)' id='"+mBetData[i][3]+"'>открыть</buttton></div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Стоимость</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][4]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";

                    html_str1+="<div class='col-md-4 col-6'>";
                        html_str1+="<div class='row text-center'>";
                            html_str1+="<div class='col-12'>Куплено</div>";
                            html_str1+="<div class='col-12'>"+mBetData[i][5]+"</div>";
                        html_str1+="</div>";
                    html_str1+="</div>";
                
                html_str1+="</div>";
                }
                html_str1+="</div>";
                document.getElementById('dinamic_Mylots').innerHTML=html_str1;
            });
    }
