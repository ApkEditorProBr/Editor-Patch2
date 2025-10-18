//Função para atualizar os números das linhas
function updateLineNumbers() {
  let lineNumberDiv = document.getElementById("vertical_number_line"); //Obtém o elemento div que contém os números das linhas
  let editorContent = document.getElementById("file-content"); //Obtém o id do elemento textarea onde o conteúdo do arquivo é digitado

  let lines = editorContent.value.split("\n"); //Separa o conteúdo do arquivo em linhas individuais
  let lineNumbers = ""; //String para armazenar os números das linhas

  for (let i = 1; i <= lines.length; i++) {
    lineNumbers += i + "\n"; //Adiciona cada número da linha à string lineNumbers
  }

  lineNumberDiv.innerText = lineNumbers; //Define a string lineNumbers como o texto do elemento div lineNumberDiv
}

//Função para sincronizar a rolagem da linha vertical com o conteúdo do arquivo
function syncScroll() {
  let lineNumberDiv = document.getElementById("vertical_number_line"); //Obtém o elemento div que contém os números das linhas
  let editorContent = document.getElementById("file-content"); //Obtém o elemento textarea onde o conteúdo do arquivo é digitado

  lineNumberDiv.scrollTop = editorContent.scrollTop; //Define a posição de rolagem do elemento div lineNumberDiv igual à posição de rolagem do elemento textarea editorContent
}

//Evento que é acionado quando a página é carregada
window.addEventListener("DOMContentLoaded", function() {
  updateLineNumbers(); //Chama a função updateLineNumbers para atualizar os números das linhas inicialmente
  document.getElementById("file-content").addEventListener("input", updateLineNumbers); //Adiciona um ouvinte de eventos para o evento de input no elemento textarea fileContent, para atualizar os números das linhas sempre que houver uma mudança no conteúdo
  document.getElementById("file-content").addEventListener("scroll", syncScroll); //Adiciona um ouvinte de eventos para o evento de rolagem no elemento textarea fileContent, para sincronizar a rolagem da linha vertical com o conteúdo do arquivo
  updateLineNumbers(); //Chama a função updateLineNumbers novamente para que a linha vertical fique estática
});
