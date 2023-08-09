const MAX_CITIES = 5;

function calc_point(n, altura){
    return (n * 100) / altura
};

const numberFormater = (n) => {
    var number;
    var unit;
    if(n > 1000000000){
        number = n/1000000000; unit = ' B';
    }else if(n > 1000000){
        number = n/1000000; unit = ' M';
    }else if(n > 1000){
        number = n/1000; unit = ' K';
    }else{
        number = n; unit = "";
    };
    return parseFloat(number.toFixed(3)).toString() + unit
};


class Graph{
    constructor(){
        this.dados = [];
        
    }
    line(){
        this.calcArea();
        this.createheader();
        
        let slopes = document.querySelector(".slopes");
        slopes.innerHTML = ""

        const colors = [
            "#2D3142", "#4F5D75", "#BFC0C0", 
            "#EF8354", "#DC6BAD"
        ];

        let markup = "";

        for (let i=0; i < this.dados.length; i++) {
            let transparencia = 0.3;

            // Aqui ele faz o último sempre ter destaque
            if (i === this.dados.length-1) {
                transparencia = 1;
            };
                        
            markup += `
            <line
                class="text slope-${i}"
                x1="0"
                y1="${calc_point(this.altura - this.dados[i].de, this.altura)}"
                x2="100"
                y2="${calc_point(this.altura - this.dados[i].para, this.altura)}"
                stroke-opacity="${transparencia}"
            />
            <text 
                class="text text-${i}"
                x="-5" 
                y="${calc_point(this.altura - this.dados[i].de, this.altura)}"
                text-anchor="end" 
                fill="red"
            >
                ${numberFormater(this.dados[i].de)}
            </text>
            <text 
                class="text text-${i}"
                x="105" 
                y="${calc_point(this.altura - this.dados[i].para, this.altura)}"
                text-anchor="start" 
                fill="red"
            >
                ${numberFormater(this.dados[i].para)} (${this.dados[i].nome} | ${this.dados[i]["var"]}%)
            </text>                
            `;
        }
        slopes.innerHTML = markup;

    }
    calcArea(){
        this.altura = 0;
        this.altura = Math.max(
            ...this.dados.reduce((acc, val) => acc.concat([val.de, val.para]), [])
        )
    };

    createheader(){
        let header = document.querySelector("#graph-header");

        header.innerHTML = ""

        for (let i=0; i < this.dados.length; i++) {
            var span = document.createElement("span");
            
            span.innerText = this.dados[i].nome;
            span.addEventListener('click', ()=>{
                this.remove(this.dados[i].nome)
            })                      
            header.appendChild(span);
        };
    };
    add(data){
        if (this.dados.length >= MAX_CITIES) {
            alert("Você atingiu o limite máximo de cidades no gráfico.");
            return;
        }else{
            this.dados.push(data);
            this.line();
        }
        
    };
    remove(nome){
        this.dados = this.dados.filter(item => item.nome !== nome);
        this.line();
    }
};




function load(){

    //importei a classe Graph do index.js 
    const graph = new Graph()
    graph.line()

    function getOptions(nome){
        filtered = file.filter((obj)=>{ return obj["NOME DO MUNICÍPIO"].toLowerCase().indexOf(nome.toLowerCase()) !== -1; });
        
        let options = document.querySelector("#options");
        
        options.innerHTML = "";

        for (let i=0; i < filtered.length; i++) {
            var span = document.createElement("span");
            
            span.innerText = `${filtered[i]["NOME DO MUNICÍPIO"]} - ${filtered[i]["UF"]}`;
            span.addEventListener('click', ()=>{
                graph.add({
                    "de": filtered[i]["2010"],
                    "para": filtered[i]["2022"],
                    "nome": filtered[i]["NOME DO MUNICÍPIO"],
                    "var": filtered[i]["Variacao"],
                });
                options.innerHTML = "";
            })                      
            options.appendChild(span);
        };
    };
    
    // aqui a gente vai fazer todo o item que foi adicionado 
    // no formulário entrar para a base.
    // Podemos fazer uma lógica parecida para busca dos dados
    // A diferença é que a gente não vai criar dado, mas sim filtrar os dados que vamos adicionar 
    // na variável dado - essa variávle que vai ser responsável por montar o gráfico.

    var form  = document.getElementById('add-new');     

    form.addEventListener('submit', (event) => {   
        event.preventDefault();
        getOptions(form.elements["nome"].value);
        form.reset()
        const container = document.querySelector('#options');
        container.classList.remove("hidden");
    });

}

function ajustarLegenda(){
    const texts = document.getElementsByTagName("text");
    var y_values_end = [...texts].filter(text => text.getAttribute("text-anchor") === "end").map(text => text.getAttribute("y"))
    var y_values_start = [...texts].filter(text => text.getAttribute("text-anchor") === "start").map(text => text.getAttribute("y"))

    for (let i = 0; i < texts.length; i++) {
        const element = texts[i];
        
    };
};

ajustarLegenda();

document.addEventListener('click', function(event){
    const container = document.querySelector('#options');
    if(!container.contains(event.target)) {
        container.classList.add("hidden")
    }
});

window.onload = load;