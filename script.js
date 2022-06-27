const calcular = document.getElementById('calcular');
const excluir = document.getElementById('excluir');

function mola() {
    var de = Number(document.getElementById('diametrodaespira').value); //diâmetro da espira
    var fmax = Number(document.getElementById('ForcaMax').value); // Força máxima sobre a mola
    var fmin = Number(document.getElementById('ForcaMin').value); // Força mínima sobre a mola
    var frequencia = Number(document.getElementById('freq').value); // Força mínima sobre a mola
    var M = Number(document.getElementById('mmaterial').value); // Propriedade referente ao material
    var A = Number(document.getElementById('amaterial').value); // Força mínima sobre a mola   
    var resultado = document.getElementById('resultado');
    var jatear = document.getElementsByName('jateamento');
    var FatordeSeguranca = 1.5;// Fator de segurança constante 
    var ymax = Number(document.getElementById('deflexmax').value);// valor da deflexão máxima
    var figma = 0.15;// constante de linearidade robusta
    var G = Number(document.getElementById('modcisalhamento').value);// módulo de cisalhamento
    var CustodoMaterial = Number(document.getElementById('custo').value);// custo do material
    var maxmolafechada = Number(document.getElementById('maxLs').value);// restrição de mola fechada
    var maxmolaaberta = Number(document.getElementById('maxLzero').value);// restrição de mola aberta
    var k = fmax/ymax;// constante de mola
    var Ssa = ''  ; // Componente de resistência alternada para vida infinita
    var Ssm = ''; // Componente de resistência média para vida infinita
    var falt = (fmax - fmin)/2 ; // Força alternada sobre a mola
    var fmed = (fmax + fmin)/2 ; // Força média sobre a mola
    var sut = A/(de**M);// Limite de resistência a tração
    var Ssu = 0.67*sut;// Módulo torcional de ruptura
    var Ssy = 0.45*sut;// Resistência ao escoamento torcional
    var pi = 3.14159 ; 
    if (jatear[0].checked){
        Ssa = 241 ;
        Ssm = 379 ;
    } else {
        Ssa = 398 ;
        Ssm = 534 ;
    }
    var alfa = Ssa/FatordeSeguranca;
    var beta = (8*falt)/(pi*(de**2));
    var C =[(2*alfa) - beta]/(4*beta) +  Math.sqrt([(2*alfa - beta)/(4*beta)]**2 - [(3*alfa)/(4*beta)])
    var D = C*de; //Diâmetro médio
    var ID = D - de; //Diâmetro interno
    var OD = D + de; //Diâmetro externo 
    var Fs= (1+figma)*fmax; // Força Operacional Máxima
    var Na = [(de**4)*(G*10**3)]/[8*(D**3)*k];// Número de espiras ativas
    var extremidade = document.getElementsByName('extremidade');
    if(extremidade[0].checked){
        var Nt = Na;// Número total de espiras
        var Ls = de*(Nt+1);//Comprimento Sólido                 
    } else {
        if (extremidade[1].checked){
            var Nt = Na+1;//Número total de espiras
            var Ls = de*Nt;//Comprimento Sólido
        }else {
            if(extremidade[2].checked){
                var Nt = Na + 2;// Número total de espiras
                var Ls = de*(Nt+1);//Comprimento Sólido
            }else if(extremidade[3].checked){
                var Nt = Na + 2;// Número total de espiras
                var Ls = de*Nt;//Comprimento Sólido                
            }
        }
    }
    var condicao_extremidade = document.getElementsByName('condicao');
    if(condicao_extremidade[0].checked){
        var alfa_condicao = 0.5;
        if (condicao_extremidade[1].checked){
            var alfa_condicao = 0.707;
        }else {
            if(condicao_extremidade[2].checked){
                var alfa_condicao = 1;
            }else if(condicao_extremidade[3].checked){
                var alfa_condicao = 2;             
            }
        }
    }
    var Lzero = Ls +(Fs/k);// Comprimento Livre da mola
    var ys = Lzero - Ls;//Comprimento de Trabalho
    var Lcrit = (2.63*D)/alfa_condicao;//Comprimento crítico para estabilidade
    var Kb = (4*C +2)/(4*C - 3);
    var W = [(pi**2)*(de**2)*D*Na*(0.000082)]/4;//peso da mola
    var Fn = 0.5*Math.sqrt((9.81*k*1000)/W);// Frequência natural da mola
    var Ta = Kb*[(8*falt*D)/(pi*de**3)];// Tensão alternada
    var Tm = Ta*(fmed/falt);// Tensão média
    var Ts = Ta*(Fs/falt);//Não entendi direito esta tensão
    var frequecia_critica = frequencia*20;    
    var fom = [(-CustodoMaterial)*(pi**2)*(de**2)*Nt*D]/(4*25**3);//Análise de custo benefício do material
    //-------------------------------------------------- Arredondamento---------------------------------------//
    C = Number(C.toFixed (2));
    D = Number (D.toFixed(2));
    ID = Number (ID.toFixed(2));
    OD = Number (OD.toFixed(2));   
    Na = Number (Na.toFixed(2));
    Ls = Number (Ls.toFixed(2));
    Lzero = Number (Lzero.toFixed(2));
    Lcrit = Number (Lcrit.toFixed(2)); 
    fom = Number(fom.toFixed(2));
    Fn = Number(Fn.toFixed(2));      
    //-------------------------------------------------- TABELA----------------------------------------------//
    var tb = document.getElementById("valores");
    var qtdLinhas = tb.rows.length;
    var linha = tb.insertRow(qtdLinhas);
    var celldiametrodaespira = linha.insertCell(0);
    var cellD = linha.insertCell(1);
    var cellID = linha.insertCell(2);
    var cellOD = linha.insertCell(3);
    var cellC = linha.insertCell(4);
    var cellNa = linha.insertCell(5);
    var cellLs = linha.insertCell(6);
    var cellL0 = linha.insertCell(7);
    var cellLcrit = linha.insertCell(8);
    var cellfn = linha.insertCell(9);   
    var cellfom = linha.insertCell(10);
    var cellstatus = linha.insertCell(11);

    celldiametrodaespira.innerHTML = de;
    cellD.innerHTML = D;
    cellID.innerHTML = ID;
    cellOD.innerHTML = OD;
    cellC.innerHTML = C;
    cellNa.innerHTML = Na;
    cellLs.innerHTML = Ls;
    cellL0.innerHTML = Lzero;
    cellLcrit.innerHTML = Lcrit;
    cellfn.innerHTML = Fn;
    cellfom.innerHTML = fom;
    if ((C>=4 && C <=12) && Ls<=maxmolafechada && Lzero<=maxmolaaberta && (Na>=3 && Na <=15)&& (Lcrit>Lzero) &&Fn>=frequecia_critica){
        cellstatus.innerHTML = "Aprovado"
    } else{
        cellstatus.innerHTML = "Reprovado"
    }



}

calcular.addEventListener('click', mola);

function delRegistro() { 
    var tb = document.getElementById("valores");
    // var qtdLinhas = tb.rows.length;
    var linha = tb.remove();       
}
excluir.addEventListener('click', delRegistro);


