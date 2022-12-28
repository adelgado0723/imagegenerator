import { Configuration, OpenAIApi } from 'openai'
import fs from 'fs'
import request from 'request'
import { v4 as uuidv4 } from 'uuid'

var download = function(uri, filename, callback) {
  request.head(uri, function() {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
  })
}

const description = 'an image description'
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

try {
  const response = await openai.createImage({
    prompt: description,
    n: 3,
    size: '1024x1024',
  })
  const dir = './images/' + description.split(' ').join('') + '/'

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  response.data.data.forEach((uri) => {
    download(uri, dir + uuidv4() + '.png', function() { })
  })
  console.log('done')
} catch (err) {
  console.log(err)
}
