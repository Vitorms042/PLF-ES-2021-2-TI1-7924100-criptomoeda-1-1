let userName = JSON.parse(sessionStorage.getItem('currentUser')).firstName;

let setLoggedOff = () => {
    sessionStorage.setItem('status', null);
    location.replace('../Login/index.html');
};

function openNav() {
    document.getElementById("mySidenav").style.width = "400px";
    document.getElementById("main").style.marginLeft = "400px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}
  
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
}

document.querySelector(
    '#header'
).innerHTML = `<nav class="navbar navbar-expand-lg navbar-light">
<div class="container">
    <div id="mySidenav" class="sidenav">
        <a href="javascript:void(0)" class="closebtn" onclick="closeNav()">&times;</a>
        <a href="./../Dashboard/index.html">Painel</a>
        <a href="./../Portfolio/portfolio.html">Portfólio</a>
        <a href="./../Ranking/index.html">Ranking</a>
        <a href="#">Biblioteca</a>
    </div>
      
    <span onclick="openNav()"><i class="openbtn bi bi-list"></i></span>

    <a class="navbar-brand" href="./../Dashboard/index.html">
        <img
            src="../../assets/images/logo-mentor.svg"
            alt="Logo"
            height="40"
        />
    </a>
    <form class="container-fluid search">
        <div class="input-group search-field">
            <input
                id="searchForm"
                type="text"
                class="form-control"
                placeholder="Busque uma criptomoeda ou token..."
                aria-label="Username"
                aria-describedby="basic-addon1"
            />
            <span
                class="input-group-text search-icon"
                id="basic-addon1"
                ><i class="bi bi-search"></i
            ></span>
        </div>
    </form>
    <div class="actions-right-header">
        <div class="user-buttons">
            <a href="#"><i class="bi bi-heart"></i></a
            ><a href="#"><i class="bi bi-bell"></i></a>
        </div>
        <div class="hello-message">
            Olá, <span class="user-name">${userName}!</span>
        </div>
        <div class="dropdown">
            <img
                class="user-avatar nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"
                src="../../assets/images/avatar.jpg"
                alt=""
            />
            <ul class="dropdown-menu account" aria-labelledby="navbarDropdown">
              <li><a class="dropdown-item" href="#">Conta</a></li>
              <li><a class="dropdown-item" href="#">Configurações</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" onclick="setLoggedOff()">Sair</a></li>
            </ul>
        </div>
    </div>
</div>
</nav>`;

searchForm.addEventListener(
    'keydown',
    function (event) {
        if (event.defaultPrevented) {
            return;
        }

        switch (event.key) {
            case 'Enter':
                location.href = `./../Single_Asset/index.html?id=${searchForm.value.trim().replace(/\s+/g, '-').toLowerCase()}`;
                break;
            default:
                return;
        }

        event.preventDefault();
    },
    true
)