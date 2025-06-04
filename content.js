// https://www.facebook.com/truyentranhdocxuoi199x/photos_albums

const imageList = []
const baseUrlList = []
let currentBaseUrl = ''

const sleep = milliSeconds => new Promise(resolve => setTimeout(resolve, milliSeconds))

const downloadBlob = (blob, fileName) => {
    const link = URL.createObjectURL(blob)

    // Tạo một thẻ a tạm và giả lập thao tác click vào thẻ đó
    const a = document.createElement('a')
    a.download = fileName
    a.innerHTML = 'Download file'
    a.href = link
    a.style.display = 'none'
    a.onclick = evt => {
        // Remove the a tag
        document.body.removeChild(evt.target)
    }

    // Gắn nó vào DOM và thực hiện thao tác click
    document.body.appendChild(a)
    a.click()

    URL.revokeObjectURL(link)
}


const saveTextAsFile = (text, fileName) => {
    // Tạo đối tượng Blob
    const textFileAsBlob = new Blob([text], { type: 'text/plain' })
    downloadBlob(textFileAsBlob, fileName)
}

function getImageUrl() {
    try {
        return document.querySelector('img[data-visualcompletion="media-vc-image"]').src
    } catch (ex) {
        return null
    }
}

async function downloadFacebookAlbum() {
    let count = 0
    while (true) {
        const imageUrl = getImageUrl()
        if (imageUrl == null) {
            await sleep(1000)
            continue
        }
        console.log(imageUrl)
        const baseUrl = imageUrl.split('?')[0]

        if (baseUrlList.includes(baseUrl)) {
            break
        }

        if (currentBaseUrl != baseUrl) {
            currentBaseUrl = baseUrl
            count++
            imageList.push({
                url: imageUrl,
                fileName: count.toString().padStart(3, '0') + '.jpg',
                folder: 'facebook-album'
            })
            baseUrlList.push(baseUrl)

            // Click next button
            try {
                [...document.querySelectorAll('div[data-name="media-viewer-nav-container"] div[aria-label][role="button"]')].pop().click()
            } catch (ex) {
                console.error(ex)
                break
            }
        }

        await sleep(1000)
    }

    console.log(imageList)
    saveTextAsFile(JSON.stringify(imageList, null, 2), 'facebook-album.json')
}

downloadFacebookAlbum()