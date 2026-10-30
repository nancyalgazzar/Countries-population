const MAX_SIZE=12;
let data=[]
let sidebar =document.querySelector(".sidebar");
let content = document.querySelector(".content");
const input = document.querySelector(".search");
const countries = document.querySelectorAll(".country");
const searchForm = document.querySelector(".search-container");

async function  getdata(region){
    let url = "https://countries.dev/countries";
    if(typeof(region)=='string'&& region.trim().toLocaleLowerCase()!='all'){
        url="https://countries.dev/region/"+region;
    }
    try {
        
        data= await (await fetch(url)).json();
        buildUI(1);
    } catch (error) {
        console.log(error)
        error = document.createElement('p');
        error.innerText = "Failed to fetch countries";
        content.innerHTML = '';
        content.append(error); 
    }
}
window.onload = async function () {
  await getdata();
};
function buildUI(page){
    let start =Math.min((page-1)*MAX_SIZE,data.length)
    let end = Math.min(page*MAX_SIZE,data.length)
    content.innerHTML = "";
    content.scrollTo({top:0});
    for(let i = start;i<end;i++)
    {
       addcard(data[i])
    }
    let pages_count= Math.ceil(data.length/MAX_SIZE);
    addResultsize(page,pages_count);
    if (pages_count>1){
        pagenation(page,pages_count);
    }
}
function addResultsize(page,page_size){
    let s= MAX_SIZE
    if( page ==page_size){
        s= data.length-(page-1)*s
    }
    let num= document.createElement("p");
    num.classList.add("count")
    num.innerText=s+" Countries";
    content.prepend(num);
}
function addcard(item){
 let card = document.createElement("div");
        card.className="card"
        card.innerHTML=`
         <div class="flag">
                <p>FLAG . ${item["alpha2Code"]}</p>
            </div>
          <div class="card-text">
            <p class="bold">${item["name"]}</p>
            <p>${item["alpha3Code"]}</p>
          </div>
          <div class="card-text">
            <p>Capital</p>
            <p class="bold">${item["capital"]}</p>
          </div>
          <div class="card-text">
            <p>Region</p>
            <p class="bold">${item["region"]}</p>
          </div>
          <div class="card-text">
            <p>Population</p>
            <p class="bold">${item["population"]}</p>
          </div>
        
        `
        content.append(card);
}
function pagenation(page,count){
    let pagenation = document.createElement("div");
    let start =1,end= count;
    if(count>10){
        start=Math.max(1,page-5);
        end=Math.min(count,page+5);
    }
    pagenation.classList.add("pagenation") 
    for(let i =start ; i<=end;i++){
        let ele = document.createElement('button');
        ele.classList.add("page");
        ele.innerText = i;
        ele.addEventListener("click",()=>buildUI(i))
        if(i==page)
            ele.classList.add("selected-page");
        pagenation.append(ele);
    }
     if(count>10){
        for(let i of [1,count]){
            let ele = document.createElement('button');
            ele.classList.add("page");
            ele.innerText= (i==1) ?'<<' : '>>';
            ele.addEventListener("click",()=>buildUI(i));
            (i==1)?pagenation.prepend(ele): pagenation.append(ele)
        }
     }
    
    content.append(pagenation);
}
countries.forEach(button => {
    button.addEventListener("click", async (event) => {
        countries.forEach(btn => btn.classList.remove("selected"));
        button.classList.add("selected");
        await getdata(event.target.innerHTML)
    });
});


searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    search();
});
async function search(){
 if(input.value.trim().length>0)
        {try{
            data = await (await fetch("https://countries.dev/name/"+input.value)).json();
        buildUI(1);}
     catch (error) {
        error = document.createElement('p');
        error.innerText = "Failed to fetch countries";
        content.innerHTML = '';
        content.append(error); 
    }}
        else{
            getdata(document.querySelector(".selected").innerHTML);
        }
}

function shownav(){
        sidebar.classList.toggle('active');
}

