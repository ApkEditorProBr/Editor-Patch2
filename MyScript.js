//Bloqueio de extensões
const blockedExtensions = ['xlsx', 'docx', 'pptx', 'pdf', 'jpeg', 'jpg', 'png', 'gif', 'mp3', 'mp4', 'zip', 'ttf', 'exe', 'csv', 'psd', 'ai', 'svg', 'rar', 'mov', 'avi'];

function displayZipFiles(file) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const zipFile = e.target.result;
    const jszip = new JSZip();

    jszip.loadAsync(zipFile).then(function (zip) {
      const files = [];

      zip.forEach(function (relativePath, zipEntry) {
        if (!zipEntry.dir) {
          files.push({
            name: relativePath,
            folderPath: relativePath.substring(0, relativePath.lastIndexOf('/')),
          });
        }
      });

      const folderPaths = Array.from(new Set(files.map((file) => file.folderPath)));
      folderPaths.sort();

      const ul = document.getElementById('zipFiles');
      ul.innerHTML = "";
      folderPaths.forEach(function (folderPath) {
        const li = document.createElement('li');
        const span = document.createElement('span');
        span.style.display = 'none';
        span.classList.add('caret');
        span.classList.add('folder-icon');
        li.appendChild(span);

        const nestedUl = document.createElement('ul');
        nestedUl.classList.add('nested');
        files
          .filter((file) => file.folderPath === folderPath)
          .forEach(function (file) {
            const nestedLi = document.createElement('li');
            nestedLi.textContent = file.name.slice(file.name.lastIndexOf('/') + 1);
            nestedLi.addEventListener('click', function () {
              const fileExtension = file.name.split('.').pop();
              if (blockedExtensions.includes(fileExtension)) {
                document.getElementById('fileContent').value = '⚠️ Não é possível exibir o conteúdo do arquivo: ' + file.name;
               
                return;
              }

              zip.file(file.name).async("string").then(function (content) {
                document.getElementById('fileContent').value = content;
                updateLineNumbers("fileContent", "vertical_number_line");
              });
            });

            const fileType = file.name.split('.').pop();
            if (fileType !== '') {
              nestedLi.classList.add('file-icon');
            }

            nestedUl.appendChild(nestedLi);
          });

        li.appendChild(nestedUl);
        ul.appendChild(li);
      });

      const toggler = document.getElementsByClassName("caret");
      for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function () {
          this.parentElement.querySelector(".nested").classList.toggle("active");
          this.classList.toggle("caret-down");
        });
      }

      const spans = document.getElementsByClassName('caret');
      for (let i = 0; i < spans.length; i++) {
        spans[i].style.display = 'block';
      }
    });
  };

  reader.readAsArrayBuffer(file);
}

function handleZipFileSelect(event) {
  const file = event.target.files[0];
  displayZipFiles(file);
}

function downloadZipFile() {
  const zip = new JSZip();
  const ul = document.getElementById('zipFiles');
  const lis = ul.getElementsByTagName('li');

  // Prompt for entering the name
  const promptName = prompt('Escolha um nome para seu patch:', 'Patch_Gerado');

  for (let i = 0; i < lis.length; i++) {
    const nestedUl = lis[i].getElementsByTagName('ul')[0];
    if (nestedUl) {
      const nestedLis = nestedUl.getElementsByTagName('li');
      for (let j = 0; j < nestedLis.length; j++) {
        const fileName = nestedLis[j].textContent;
        const folderName = lis[i].getElementsByTagName('span')[0].textContent;
        const filePath = folderName !== '' ? folderName + '/' + fileName : fileName;
        const fileContent = document.getElementById('fileContent').value;

        zip.file(filePath, fileContent);
      }
    }
  }

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, `${promptName}.zip`);
  });
}

const navbar = document.querySelector('.navbar');

const uploadButton = document.createElement('button');
uploadButton.id = 'uploadButton';
uploadButton.textContent = 'Carregar';
uploadButton.addEventListener('click', function () {
  document.getElementById('zipFileInput').click();
});

const zipFileInput = document.createElement('input');
zipFileInput.id = 'zipFileInput';
zipFileInput.type = 'file';
zipFileInput.style.display = 'none';
zipFileInput.addEventListener('change', handleZipFileSelect);

const downloadButton = document.createElement('button');
downloadButton.id = 'downloadButton';
downloadButton.textContent = 'Baixar';
downloadButton.addEventListener('click', function () {
  downloadZipFile();
});

navbar.appendChild(uploadButton);
navbar.appendChild(zipFileInput);
navbar.appendChild(downloadButton);