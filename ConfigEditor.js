const blockedExtensions = [
  'xlsx', 'docx', 'pptx', 'pdf', 'jpeg', 'jpg', 'png', 'gif',
  'mp3', 'mp4', 'zip', 'ttf', 'exe', 'csv', 'psd', 'ai', 'svg',
  'rar', 'mov', 'avi'
];

function checkExtension(fileName) {
  const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
  return blockedExtensions.includes(extension);
}

document
  .getElementById("upload-btn")
  .addEventListener("change", function (e) {
    var file = e.target.files[0];
    
    var zip = new JSZip();
    zip.loadAsync(file).then(function (zip) {
      zip.forEach(function (relativePath, zipEntry) {
        if (!checkExtension(zipEntry.name)) {
          var listItem = document.createElement("li");
          var fileIcon = document.createElement("span");
          var fileName = document.createElement("span");
          
          fileIcon.classList.add("file-icon");
          fileIcon.innerText = zipEntry.dir ? "📁" : "📄";
          
          fileName.innerText = zipEntry.name;
          
          listItem.appendChild(fileIcon);
          listItem.appendChild(fileName);
          
          document.getElementById("file-list").appendChild(listItem);
          
          listItem.addEventListener("click", function () {
            if (!zipEntry.dir) {
              zipEntry.async("text").then(function (content) {
                document.getElementById("file-content").value = content;
                document.getElementById("file-content").removeAttribute("disabled");
                document.getElementById("save-btn").style.display = "block";document.getElementById('file-content').value = content;
                    updateLineNumbers("file-content", "vertical_number_line");
              });
            }
          });
        }
      });
      
      fileCount = zip.files.length;
      processedFiles = 0;
      createdZip = zip;
      
      document.getElementById("download-btn").disabled = false;
    });
  });

function addFile() {
  let fileName = prompt("Digite o nome do arquivo:");
  let fileContent = ""; // inicialmente vazio
  
  if (fileName) {
    if (checkExtension(fileName)) {
      alert("Extensão de arquivo bloqueada");
    } else {
      let listItem = document.createElement("li");
      let fileIcon = document.createElement("span");
      let fileLabel = document.createElement("span");
      
      fileIcon.classList.add("file-icon");
      if (fileName.endsWith("/")) {
        fileIcon.innerText = "📁"; // ícone de pasta
      } else {
        fileIcon.innerText = "📄"; // ícone de arquivo
      }
      
      fileLabel.innerText = fileName;
      
      listItem.appendChild(fileIcon);
      listItem.appendChild(fileLabel);
      
      document.getElementById("file-list").appendChild(listItem);
      
      listItem.addEventListener("click", function () {
        if (!fileLabel.innerText.endsWith("/")) {
          document.getElementById("file-content").value = fileContent;
          document.getElementById("file-content").removeAttribute("disabled");
          document.getElementById("save-btn").style.display = "block";
          
          document.getElementById("download-btn").disabled = false; // Habilitar o botão de download
        }
      });
      
      if (!fileName.endsWith("/")) {
        document.getElementById("file-content").addEventListener("input", function () {
          fileContent = this.value; // Atualizar o conteúdo do arquivo
        });
      }
      
      createdZip.file(fileName, fileContent); // Adicionar o arquivo ao ZIP
      
      processedFiles++;
      
      document.getElementById("file-content").setAttribute("disabled", true);
      document.getElementById("file-content").value = "";
      
      if (processedFiles === fileCount) {
        document.getElementById("save-btn").style.display = "none";
      }
    }
  }
}

function saveContent() {
  var content = document.getElementById("file-content").value;
  let fileName = prompt("Digite o caminho/arquivo:");
  
  if (fileName) {
    if (checkExtension(fileName)) {
      alert("Extensão de arquivo bloqueada");
    } else {
      let listItem = document.createElement("li");
      let fileNameSpan = document.createElement("span");
      
      fileNameSpan.innerText = fileName;
      listItem.appendChild(fileNameSpan);
      document.getElementById("file-list").appendChild(listItem);
      
      createdZip.file(fileName, content);
    }
  }
}

function downloadZIP() {
  var nome = prompt("Digite o nome do arquivo ZIP:");
  
  createdZip.generateAsync({ type: "blob" })
    .then(function (content) {
      var link = document.getElementById("download-link");
      link.href = URL.createObjectURL(content);
      link.download = nome + ".zip";
      link.click();
    });
}