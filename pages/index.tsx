export const TopPage = () => {
    return (
        <>
        <head>
            <title>HonoCMS</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <script>{readFunc}</script>
            <script>{createFunc}</script>
        </head>
        <Header />
        <main class="mx-5">
            <h1 class="text-3xl font-bold mb-1">Hello HonoCMS!</h1>
            <p class="mb-5">This page is work in progress</p>
            <h2 class="text-2xl font-bold">DataBase</h2>
            <input id="db-name" type="text" value="example" class="bg-zinc-300" /><br></br>
            <div>
                <button class="my-1 mr-2 text-xl border rounded px-1 py-1 transition bg-zinc-200 hover:bg-zinc-400" onClick="readDB()">Read</button>
                <button class="my-1 text-xl border rounded px-1 py-1 transition bg-zinc-200 hover:bg-zinc-400" onClick="createDB()">Create</button>
            </div>
            <p id="database" class="h-10"></p>
        </main>
        </>
    );
};
export const Header = () =>{
    return(
        <header class="bg-orange-500 py-2 mb-5">
            <div class="text-xl font-bold mx-3 text-white">
                HonoCMS
            </div>
        </header>
    )
}

async function readDB() {
    const dbName = document.getElementById('db-name') as HTMLInputElement
    const headersList = {
        'Accept': '*/*',
        'Authorization': 'Bearer honoiscool'
       }
    const response = await fetch('/api/armor/get/' + dbName?.value, { 
         method: 'GET',
         headers: headersList
    });
    const jsonData = await response.text();
    const message = JSON.parse(jsonData).message
    if(message!== undefined){
        document.getElementById('database')!.innerHTML = message
    }else{
        document.getElementById('database')!.innerHTML = jsonData
    }
}
async function createDB() {
    const dbName = document.getElementById('db-name') as HTMLInputElement
    const headersList = {
        'Accept': '*/*',
        'Authorization': 'Bearer honoiscool'
       }
    const response = await fetch('/api/armor/create/' + dbName?.value, { 
        method: 'POST',
        headers: headersList
      });
    const jsonData = await response.text();
    const message = JSON.parse(jsonData).message
    document.getElementById('database')!.innerHTML = message   
}
const readFunc = '' + readDB
const createFunc = '' + createDB