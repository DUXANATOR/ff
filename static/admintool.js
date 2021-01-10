let admin_role, AuAd_login;
function login_check(){
    let login=document.getElementById('login_adpan').value;
    let password=document.getElementById('pass_adpan').value;
    function ajaxRequest(){
    return $.ajax({
        type:"GET",
        url:"/log_emp",
        data:{login, password}
        });
    };
    $admin=ajaxRequest();
    $admin
    .done(function(data){
        if(data=='wrong'){
            alert('проверьте правильность логина и пароля');
        }else{
        admin_role=data;     
            document.getElementById('admin_login_check').style.display='none';
            document.getElementById('admin_login_site').style.display='block';
            let elem=document.getElementById('admin_act_role');
            html_str1='';
            AuAd_login=login;
            html_str1+="<div class='col-6 mt-2'><button class='btn-opt btn' onclick='lotsOnAuction()'>Предметы на аукционе</button></div>";
            AuAd_login=login;
            if (admin_role=='Администратор'){
                html_str1+="<div class='col-6 mt-2'><button class='btn-opt btn' onclick='report_buy()'>Отчёт о покупках</button></div>";
                html_str1+="<div class='col-6 mt-2'><button class='btn-opt btn' onclick='report_seller()'>Отчёт по продавцам</button></div>";
                html_str1+="<div class='col-6 mt-2'><button class='btn-opt btn' onclick='report_bets()'>История ставок</button></div>";
                elem.innerHTML=html_str1;
            }else if(admin_role=='Модератор аукциона'){
                html_str1+="<div class='col-6 mt-2'><button class='btn-opt btn' onclick='open_auctions()'>Открытие аукционов</button></div>";
                elem.innerHTML=html_str1;
            }
        }
    });
}

function export_docx(){
    let src=document.getElementById('rep').src;
    src=src.replace('html','docx');
    src=src.replace('pdf','docx');
    src=src.replace('xlsx','docx');
    document.getElementById('rep').src=src;
}
function export_XLSx(){
    let src=document.getElementById('rep').src;
    src=src.replace('html','xlsx');
    src=src.replace('docx','xlsx');
    src=src.replace('pdf','xlsx');
    document.getElementById('rep').src=src;
}
function export_PDF(){
    let src=document.getElementById('rep').src;
    src=src.replace('html','pdf');
    src=src.replace('docx','pdf');
    src=src.replace('xlsx','pdf');
    document.getElementById('rep').src=src;
}  

/*предметы на ауционе*/
function lotsOnAuction(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row justify-content-center align-items-center'>";

    html_str1+="<div class='col-6 mb-4'>";
    html_str1+="<form>";
    html_str1+="<span class='bodyItem'>Аукцион</span>";
    html_str1+="<select id='lotsOnAuction' class='form-control mb-2'>";
    html_str1+="</select>";
    html_str1+="</form>";
    html_str1+="</div>";
    html_str1+="<div class='col-6 mb-4'>";
    html_str1+="<button class='btn btn-opt mt-4' type='button' onclick='lots_generation()'>генерировать</button>";
    html_str1+="</div>";

    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt btn-docx mt-4' type='button' onclick='export_docx()'>DOCX</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt mt-4 btn-xls' type='button' onclick='export_XLSx()'>XLSx</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt mt-4 btn-pdf' type='button' onclick='export_PDF()'>PDF</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    let login=AuAd_login;
    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/moder_auctions",
            data: {login}
            });
        }
        $sel=ajaxRequest();
        $sel
        .done(function(data){
            html_str1='';
            selData=JSON.parse(data);
            html_str1='';
            let auct_name;
            for(i=0; i<selData.length; i++){
                html_str1+="<option value='"+selData[i][0]+"'>"+selData[i][1]+"</option>";
                if(i==0){
                    auct_name=selData[i][0];
                }
            }
            content=document.getElementById('lotsOnAuction');
            content.innerHTML=html_str1;
            var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/auctions/lots.html?aucid="+auct_name+""; 
            var iframe = document.createElement('iframe');
            frameborder=0;
            iframe.width="100%";
            iframe.height=window.innerHeight*0.6;
            iframe.id="rep";
            iframe.setAttribute("src", link);
            document.getElementById("reports").appendChild(iframe);
        });

}

    function lots_generation(){
        let n=document.getElementById('lotsOnAuction').options.selectedIndex;
        auct_name=document.getElementById('lotsOnAuction').options[n].value;
        console.log(auct_name);
        document.getElementById('rep').src="http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/auctions/lots.html?aucid="+auct_name+"";
    }

/*отчет о продавцах*/
function report_seller(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row justify-content-center align-items-center'>";

    html_str1+="<div class='col-6 mb-4'>";
    html_str1+="<form>";
    html_str1+="<span class='bodyItem'>Продавец</span>";
    html_str1+="<select id='seller' class='form-control mb-2'>";
    html_str1+="</select>";
    html_str1+="</form>";
    html_str1+="</div>";
    html_str1+="<div class='col-6 mb-4'>";
    html_str1+="<button class='btn btn-opt mt-4' type='button' onclick='seller_generation()'>генерировать</button>";
    html_str1+="</div>";

    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt btn-docx mt-4' type='button' onclick='export_docx()'>DOCX</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt mt-4 btn-xls' type='button' onclick='export_XLSx()'>XLSx</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt mt-4 btn-pdf' type='button' onclick='export_PDF()'>PDF</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/seller",
            data:'seller'
            });
        }
        $sel=ajaxRequest();
        $sel
        .done(function(data){
            html_str1='';
            selData=JSON.parse(data);
            html_str1='';
            let seller_name;
            for(i=0; i<selData.length; i++){
                html_str1+="<option value='"+selData[i][0]+"'>"+selData[i][1]+"</option>";
                if(i==0){
                    seller_name=selData[i][0];
                }
            }
            content=document.getElementById('seller');
            content.innerHTML=html_str1;
            var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/auctions/lots_seller.html?login="+seller_name+""; 
            var iframe = document.createElement('iframe');
            frameborder=0;
            iframe.width="100%";
            iframe.height=window.innerHeight*0.6;
            iframe.id="rep";
            iframe.setAttribute("src", link);
            document.getElementById("reports").appendChild(iframe);
        });
}
    function seller_generation(){
        let n=document.getElementById('seller').options.selectedIndex;
        seller_name=document.getElementById('seller').options[n].value;
        document.getElementById('rep').src="http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/auctions/lots_seller.html?login="+seller_name+"";
    }
/*отчет по покупкам*/
function report_buy(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row justify-content-center align-items-center'>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt btn-docx mt-4' type='button' onclick='export_docx()'>DOCX</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt mt-4 btn-xls' type='button' onclick='export_XLSx()'>XLSx</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt mt-4 btn-pdf' type='button' onclick='export_PDF()'>PDF</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/auctions/purchases.html"; 
    var iframe = document.createElement('iframe');
    frameborder=0;
    iframe.width="100%";
    iframe.height=window.innerHeight*0.6;
    iframe.id="rep";
    iframe.setAttribute("src", link);
    document.getElementById("reports").appendChild(iframe);
}
/*история ставок*/
function report_bets(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row justify-content-center align-items-center'>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt btn-docx mt-4' type='button' onclick='export_docx()'>DOCX</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt mt-4 btn-xls' type='button' onclick='export_XLSx()'>XLSx</button>";
    html_str1+="</div>";
    html_str1+="<div class='col-4 mb-4'>";
    html_str1+="<button class='btn btn-opt mt-4 btn-pdf' type='button' onclick='export_PDF()'>PDF</button>";
    html_str1+="</div>";
    html_str1+="</div>";
    document.getElementById("reports").innerHTML=html_str1;
    var link = "http://26.173.145.160:8080/jasperserver/rest_v2/reports/reports/auctions/log_BET.html"; 
    var iframe = document.createElement('iframe');
    frameborder=0;
    iframe.width="100%";
    iframe.height=window.innerHeight*0.6;
    iframe.id="rep";
    iframe.setAttribute("src", link);
    document.getElementById("reports").appendChild(iframe);
}

/*Открыть аукцион*/
function open_auctions(){
    document.getElementById("reports").innerHTML='';
    html_str1='';
    html_str1+="<div class='row justify-content-center align-items-center'>";
    let login=AuAd_login;
    function ajaxRequest(){
        return $.ajax({
            type:"GET",
            url:"/moder_auctions",
            data: {login}
            });
        }
        $sel=ajaxRequest();
        $sel
        .done(function(data){
            auctData=JSON.parse(data);
            for(i=0; i<auctData.length; i++){
                html_str1+="<div class='col-4 mb-2 mt-2'>";
                html_str1+="<div class='row'><div class='col-12 h5'>Номер аукциона</div><div class='col-12'>"+auctData[i][0]+"</div></div>";
                html_str1+="</div>";
                
                html_str1+="<div class='col-4 mb-2 mt-2'>";
                html_str1+="<div class='row'><div class='col-12 h5'>Дата начала</div><div class='col-12'>"+auctData[i][2]+"</div></div>";
                html_str1+="</div>";

                html_str1+="<div class='col-4 mb-2 mt-2'>";
                html_str1+="<div class='row'><div class='col-12 h5'>Дата окончания</div><div class='col-12'>"+auctData[i][3]+"</div></div>";
                html_str1+="</div>";

                html_str1+="<div class='col-4 mb-4 mt-2'>";
                html_str1+="<div class='row'><div class='col-12 h5'>Имя аукциона</div><div class='col-12'>"+auctData[i][1]+"</div></div>";
                html_str1+="</div>";

                html_str1+="<div class='col-4 mb-4 mt-2'>";
                html_str1+="<div class='row'><div class='col-12 h5'>Активен</div><div class='col-12'>"+auctData[i][4]+"</div></div>";
                html_str1+="</div>";

                html_str1+="<div class='col-4 mb-4 mt-2'>";
                html_str1+="<button class='btn btn-opt' type='button' id='"+auctData[i][0]+"' onclick='update(this)'>Активировать</button>";
                html_str1+="</div>";

            }
            html_str1+="</div>";
            document.getElementById("reports").innerHTML=html_str1;
        });
}
    function update(elem){
        let id_auction=elem.id
        function ajaxRequest(){
            return $.ajax({
                type:"GET",
                url:"/upd_auctions",
                data: {id_auction}
                });
            }
            $sel=ajaxRequest();
            $sel
            .done(function(data){
                if(data=='success'){
                    console.log('Успешно');
                    open_auctions();
                }
            });
    }