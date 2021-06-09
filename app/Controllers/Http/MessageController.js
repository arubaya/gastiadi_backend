'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
// use('@tensorflow/tfjs-node')
const Message = use('App/Models/Message')
const tf = use('@tensorflow/tfjs-node')
const Helpers = use('Helpers')
const Encoder = use('@tensorflow-models/universal-sentence-encoder') 

/**
 * Resourceful controller for interacting with messages
 */
class MessageController {
  /**
   * Get all messages by room id
   * GET messages/room/:id
   */
  async getMessagesByRoomId ({ response, params }) {
    const id = params.id;

    const result = await Message
    .query()
    .select('messages.user_id', 'users.name', 'messages.message')
    .where('chat_room_id', id)
    .innerJoin('users', 'messages.user_id', 'users.id')
    .fetch();
    
    if(result) {
      return response.status(200).json({data: result});
    } else {
      return response.status(200).json({message: 'Room id not found'});
    }
  }

  async tryML ({ request, response }) {

    // const {input} = request.all();
    let input = 'Tolong, ada anak kecil dipukulin di dekat rumah saya'
    const MAX_SEQUENCE_LENGTH = 20;

    function word_preprocessor(word) {
      word = word.replace(/[-|.|,|\?|\!]+/g, '');
      word = word.replace(/\d+/g, '1');
      word = word.toLowerCase();
      if (word != '') {
        return word;
      } else {
        return '.'
      }
    };
    
    function make_sequences(words_array) {
      let sequence = Array();
      let words_vocab = {}
      words_array.slice(0, MAX_SEQUENCE_LENGTH).forEach(function(word) {
        word = word_preprocessor(word);
        // console.log(word)
        let id = words_vocab[word];
        if (id == undefined) {
          sequence.push(words_vocab['<UNK>']);
        } else {
          sequence.push(id);
        }  
      });
    
      // pad sequence
      if (sequence.length < MAX_SEQUENCE_LENGTH) {
        let pad_array = Array(MAX_SEQUENCE_LENGTH - sequence.length);
        pad_array.fill(words_vocab['<UNK>']);
        sequence = sequence.concat(pad_array);
      }
    
      return sequence;
    };
    const model = await tf.loadLayersModel('http://localhost:8080/api/v1/model.json', 
    'http://localhost:8080/api/v1/group1-shard1of1.bin');
    const emodel = tf.model({inputs: model.input, outputs: model.output});

    const wordsArray = input.split(' ');
    const sequence = make_sequences(wordsArray);
    let tensor = tf.tensor1d([5, 6, 45, 1264, 381, 17, 48, 59, 149, 278, 9, 12, 57, 23, 132, 0, 0, 0, 0, 0]).print();
    // [5, 6, 45, 1264, 381, 17, 48, 59, 149, 278, 9, 12, 57, 23, 132]

    // model.compile()
    const output = emodel.predict(tensor)

    // const m = tf.variable(tf.tensor(4.0))
    console.log(`console: ${output}`);
    
  }

  async model ({ request, response, params }) {
    const fileName = params.filename
    const modelPath = Helpers.resourcesPath(fileName)
    return response.download(modelPath)
  }

}

module.exports = MessageController
