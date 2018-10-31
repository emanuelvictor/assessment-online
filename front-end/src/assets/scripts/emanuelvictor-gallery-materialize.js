/**
 * Created by Emanuel Victor on 12/03/2017.
 */
/**
 * Função auxiliar para avanço de índice de array
 */
var getCurrent = function () {
  if (this.current != undefined) {
    this.current = this.current + 1;
  } else {
    this.current = 0;
  }
  if (this.current == this.length) { //TODO this.length??
    this.current = 0;
  }
  return this.current;
};
/**
 * Variável auxiliar que informa qual foto deve ter seu source trocado
 */
var element = 2;
/**
 * Todas as fotos horizontais. Para o site e smartphones em landscape
 */
var fotosHorizontais = [];
fotosHorizontais.getCurrent = getCurrent;
/**
 * Todas as fotos verticais. Para smartphones em portrait
 */
var fotosVerticais = [];
fotosVerticais.getCurrent = getCurrent;
/**
 * Troca o slide
 *
 */
var nextSlide = function () {
  $('.carousel').carousel('next');
};
/**
 * Troca o source da foto
 * @param proximaFoto
 */
var switchFoto = function (proximaFoto) {
  setTimeout(function () {
    document.getElementById(element).setAttribute("src", proximaFoto);
    if (element == 2) {
      element = 1;
    } else {
      element = 2
    }
  }, 1000);
};
/**       *
 * Requisita todos os id's das fotos
 */
var getAllFotos = function () {
  $.ajax({
    type: 'GET',
    url: 'https://graph.facebook.com/252079158585125/photos?fields=height,width',
    headers: {
      "Authorization": "OAuth EAAZAnTibTLOABAEZBimBGSH3qLURGSy6RDZBXn08SGHU9mHVcaTO3OFilJZAcXmcoXqfgK40WlpyiAf8dZAefr0I8AL661FmJP3lbZAY5J57zjeCh3af5A622yQzZCvBUwalycmChPWZC7C73j34eKUCQyjNXjuHOr0ZD"
    }, success: function (data) {
      for (var i = 0; i < data.data.length; i++) {
        if (data.data[i].height - data.data[i].width > -20) {
          fotosVerticais.push(data.data[i]);
          fotosVerticais[fotosVerticais.length - 1].index = fotosVerticais.length - 1;
        } else {
          fotosHorizontais.push(data.data[i]);
          fotosHorizontais[fotosHorizontais.length - 1].index = fotosHorizontais.length - 1;
        }
      }
      nextSlide();
    }
  });
};
/**
 * Vai para proximo slide e troca a foto
 */
var next = function () {
  //TODO aqui terá o IF de landscape
  if (document.documentElement.clientWidth > document.documentElement.clientHeight) {
    var idProximaFoto = fotosHorizontais[fotosHorizontais.getCurrent()].id;
  } else {
    var idProximaFoto = fotosVerticais[fotosVerticais.getCurrent()].id;
  }
  $.ajax({
    type: 'GET',
    url: 'https://graph.facebook.com/' + idProximaFoto + '/?fields=webp_images', // id deve ser random
    headers: {
      "Authorization": "OAuth EAAZAnTibTLOABAEZBimBGSH3qLURGSy6RDZBXn08SGHU9mHVcaTO3OFilJZAcXmcoXqfgK40WlpyiAf8dZAefr0I8AL661FmJP3lbZAY5J57zjeCh3af5A622yQzZCvBUwalycmChPWZC7C73j34eKUCQyjNXjuHOr0ZD"
    }, success: function (data) {
      nextSlide();
      proximaFoto = data.webp_images[0].source;
      switchFoto(proximaFoto);
    }
  });
};
/**
 * Loop recursivo para troca de slides e background
 */
var start = function () {
  setTimeout(function () {
    // Se já requisitou as fotos começa o processo de troca das mesmas
    if (fotosHorizontais.length || fotosVerticais.length) {
      next();
      // Se não requisitou as fotos, requisita elas
    } else {
      getAllFotos()
    }
    start()
  }, 8000);
};
// /**
//  * Inicia o loop recursivo para troca de slides e background
//  */
// start();
