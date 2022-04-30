const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=2&api_key=c08d415f-dea7-4a38-bb28-7b2188202e46'; //url para obtener los gatos
const API_URL_FAVOTITES = 'https://api.thecatapi.com/v1/favourites?api_key=c08d415f-dea7-4a38-bb28-7b2188202e46';// url donde se guardaran los gatos favoritos
const API_URL_FAVOTITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=c08d415f-dea7-4a38-bb28-7b2188202e46`; // api para poder eliminar uno de ellos de favoritos

const spanError = document.getElementById('error')


// carga de gatos aleatorios hacia el dom(html)
async function loadRandomMichis() {
  const res = await fetch(API_URL_RANDOM); // hacemos la extracion de la api con fetch 
  const data = await res.json();// convertimos a json
  console.log('Random')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status;// mandamos mnsj a inicio
  } else {
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    
    img1.src = data[0].url;
    img2.src = data[1].url;

    btn1.onclick = function(){saveFavouriteMichi(data[0].id)};
    btn2.onclick = () => saveFavouriteMichi(data[1].id);
  }
}

// cargamos los gatos que estan en favoritos
async function loadFavouriteMichis() {
  const res = await fetch(API_URL_FAVOTITES);
  const data = await res.json();
  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {

    const section = document.getElementById('favoritesMichis')
    section.innerHTML = ""; //limpiamos el section para que no aparezca img rotas sin agregar gatos aun

    const h2 = document.createElement('h2'); 
    const h2Text = document.createTextNode('Michis favoritos');
    h2.appendChild(h2Text);
    section.appendChild(h2); //creamos un section con sus hijos

    data.forEach(michi => { // recorremos los gatos que estan en favoritos ya 
      const article = document.createElement('article');
      article.setAttribute( // asignamos estilos 
        'style',
        'display: flex; flex-wrap: nowrap;flex-direction: column;align-items: center;gap: 10px;',
      );

      const img = document.createElement('img');
      img.setAttribute(
        'style',
        'border-radius:20px',
      );

      const btn = document.createElement('button');
      const btnText = document.createTextNode('Sacar al michi de favoritos');

      img.src = michi.image.url;
      img.width = 150;
     
      btn.appendChild(btnText); // agregamos el btnText como texto en el btn
      btn.onclick = () => deleteFavouriteMichi(michi.id);
    
      article.appendChild(img);
      article.appendChild(btn);
      section.appendChild(article);
    });
  }
}

async function saveFavouriteMichi(id) {
  const res = await fetch(API_URL_FAVOTITES, {
    method: 'POST', // metodo https post para mandar la imagen a guardar a favoritos
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ //stringify el objeto puede estar escrito en python, c, ruby, go etc.. por lo tanto lo casteamos a un string global para cualquier lenguaje de programacion sin que haya errores
      image_id: id
    }),
  });



  const data = await res.json();
  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    console.log('Michi guardado en favoritos')
    loadFavouriteMichis();
  }
}

async function deleteFavouriteMichi(id) {
  const res = await fetch(API_URL_FAVOTITES_DELETE(id), {//mandamos el id a eliminar  con la url inicializada arriba
    method: 'DELETE',
  });
  const data = await res.json();
  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error: " + res.status + data.message;
  } else {
    console.log('Michi eliminado de favoritos')
    loadFavouriteMichis();
  }
}

loadRandomMichis();
loadFavouriteMichis();