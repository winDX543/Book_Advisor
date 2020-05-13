'use strict';

// Imports dependencies and set up http server
const
  requestify = require('requestify'),
  express = require('express'),
  bodyParser = require('body-parser'),
  request = require('request'),
  ejs = require("ejs"),
  fs = require('fs'),
  PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN,
  app = express().use(bodyParser.json()); // creates express http server 
const sendmessageurl = 'https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN

app.use(express.static('public'));
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public');
// database setup
var newregister = '';
//var userlogin='';
var bybookname = '';
var byauthor = '';
var uploadvideo = '';
let upvideoum = '';
let aa = '';

var upvideobookname = '';
var admin = require("firebase-admin");
let uploadingVid = false;

let userSessions = [];

function newUser(id) {
  return { id: id, newregister: '', bybookname: '', byauthor: '', uploadvideo: '', upvideoum: '', upvideobookname: '' ,bookname:'', ownercondition:'' };
}

var serviceAccount = {
    "type": "service_account",
  "project_id": "bookadvisor-c48dd",
  "private_key_id": "f665ee98afca0d3d419e5dc96edf9bd2bede0822",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9uOuGmPvbMdJL\nSfnkLPu0mdsIADJfn8N0/j7KEBejcChXm8AhtmMe/63B0ONCR+ghxZ8iF8/L+Q33\nxZYIutsmj/PV9o/lPPnXUN2RA4VX2uWbTv3DujoG6tX6esM+N4qbSfLaPOBq34As\nK028R6rptfE2HdJyDuTYtWfqK+Nunl8dRS2uJKgsmhGytNDOX6QdBrqmfnWYGpCV\nFlH1YODoMFE2Sy55WE0MIA+oQfz8QMwcod/dY5iT6eTHLANmK7oB9dd3YXojyIj1\nhmnH5+M3f0pZQX1h4GWXVWtp3+gwhGMiVAVv2ilpip2k3PCMKAhv/1D6IFjmb8RP\nCM26gqHZAgMBAAECggEALzDnmNfF0dx/KA4TE/AifeZFRqSx4vo85oV1PdKp5pP3\n3O7XaCtTVXsYj9yzIqH7OidLcXIF1IEzOb3Sl4JPD7T/3GlTmpxDswygyDjdeqBu\nu2Z3Fa/lTiIsrnzJwtiS6BSJTUKWOc81NQdicyJKf46rnJ/nYEqXHtZkrilTjYh2\nhLhGd3M68aOGBbS8FUZ1/obFjQGi4zrvsCTnG9h8rXkHeTo4hJPHUJwwvpcnBoPa\ntpZifEAY5aeOTfu1lU/H4sPpfsorg0wQNeiml3LdAKDaVHD4PZlu0ntIuoHbJ7hG\nLpkhE6M6f36rm1vr4SH8+fKHTMxeSWjPU0v6gU8VfwKBgQDjTqmULQ1FIAMCz0rt\nLeRNEKWNjA11Ik02UoJhLl3sdMsus7VhIofX7gnovMkJ9q7GD/HY3vhOQ1DIfEpj\njlH7JCiCOszSttSQL7drtmpwM2mn+pf8ONEAY3VPoD7gX7lv4SzVqyU/jRzMio8O\nmwu8YOUFeaIDdZwAPlpfCUSBvwKBgQDVq7dyqBzmlKqZbxbpggXmlXTQG3OOLQQ7\nVGKIEwyWxs3TrfDpzlFRqNL45weifRaR/1JoBPNhJwe3CDGarRswcASfd3Xkj+S1\nEKQCqQLzTXzVkXvRimYtYkN7C0FJv3rqelmsJfkTLs1T0K7eAdJeUuetQzSoIE2U\nJn1UL+0SZwKBgQCL7ajG5tT8cLBp0mI1j8KzDkRb1pOSQAN4JWLNoFWBcoSBw28s\n1Kz7aDYBZ/X6hDkjBD3FW71PsHDSenDwyHP/PksRoFDmhlZkTHuFe04atAuetM1L\nH07KBm/5DJSoW0U0clG/VxQfAydvYvyd6SRYWu2haTcrGgNmwvuu9W2O0QKBgQCW\n3TyUrxBg2f0ugppZ2x1RdptYyNkpPK2tOmKrk0+jMdFoMXtVigAuuRXk+jKQzuNd\nyDmmCkDRit5OpHFptenppF4PPii2bcbc9VfoLO9RXJfUr3kONTr5tlTRDtxVNuaR\nojuoadNYcQY2tLSTOhQP11ePJVGLl+tOvHJnO8OW5wKBgHWDQS/QEjQqef6Eq79r\nY5/VwFpHhSzaFkPG+5Ty4xbPFcs/hFirfDNLASWf0zQgNATZTtD9qqwB25okS+qV\nEI0u8GwwaiEIQK9VBU/88Uos9R11hqCNQF+EvZMH7finFN53t9UugF+x3MlljDh7\naIv8HzRYfOwau582Arou/5OP\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-iq6t9@bookadvisor-c48dd.iam.gserviceaccount.com",
  "client_id": "117745392817268264598",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-iq6t9%40bookadvisor-c48dd.iam.gserviceaccount.com"
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bookadvisor-c48dd.firebaseio.com"
});

const db = admin.firestore();

//get_started and greeting 

	requestify.post('https://graph.facebook.com/v2.6/me/messenger_profile?access_token=' + PAGE_ACCESS_TOKEN,
	  {
	    "get_started": { "payload": "Hi" },
	     
	    "greeting": [
	      {
	        "locale": "default",
	        "text": "Hello {{user_first_name}}! \nWe provide service!!"
	      }
	    ]
	  }
	)


// Sets server port and logs message on success

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.get('/', (req, res)=>{
	res.send("Hello World!");
})


// Adds support for GET requests to our webhook

app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFICATION_TOKEN;

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});



// Creates the endpoint for our webhook 

app.post('/webhook', (req, res) => {

  let body = req.body;
  let revieweryes = 'true';
  let reviewerno = 'false';
  let userMessage;
  let userMedia;
  let userInput = '';
  let currentUser = null;
  //let isreviewer = true;
  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      var senderID = webhook_event.sender.id;
      
      currentUser = userSessions.find(user => user.id === senderID);
      if (!currentUser) { // if the user is new
        currentUser = newUser(senderID);
        userSessions.push(currentUser);
      }

      console.log('senderID', senderID);
      if (webhook_event.postback) {
        userInput = webhook_event.postback.payload;
      }
      if (webhook_event.message) {
        if (webhook_event.message.text && webhook_event.message.is_echo !== true) {
          userMessage = webhook_event.message.text;
        }
        if (webhook_event.message.attachments) {
          userMedia = webhook_event.message.attachments.payload;
        }
        if (webhook_event.message.quick_reply) {
          var userQuickreply = webhook_event.message.quick_reply.payload;
        }
      }

      db.collection('admin').where('adminid', '==', `${senderID}`).get().then(adminList => {
        if (adminList.empty) {
          db.collection("bookshopowner").where('ownerid', '==', `${senderID}`).get().then(bookshopownerlist => {
            if (bookshopownerlist.empty) {
              db.collection("user").where('userid', '==', `${senderID}`).where('isreviewer', '==', `${revieweryes}`).get().then(reviewerlist => {
                if (reviewerlist.empty) {
                  db.collection("user").where('userid', '==', `${senderID}`).where('isreviewer', '==', `${reviewerno}`).get().then(userlist => {
                    if (userlist.empty) {
                      // #region  New User
                      if (userInput == 'Hi') {
                        //textMessage(senderID,"Welcome New User");
                        QuickReplyNewUser(senderID);

                      }
                      if (userQuickreply == 'seller') {
                        db.collection('bookshopowner').add({
                          ownerid: senderID
                        }).then(own => {
                          textMessage(senderID, "Register Successful").then(()=>{
                             textMessage(senderID, "Please type 'Login' to start Process")
                          })
                         
                        })
                      }
                      if (userQuickreply == 'reader') {
                        textMessage(senderID, "Please type 'Register' ");
                        newregister = 'reader';
                      }
                      if (newregister == 'reader') {
                        if (userMessage == 'Register') {
                          UserRegister(senderID, userMessage);
                          newregister = '';
                        }
                      }

                      // #endregion

                    }
                    else {
                      // #region Reader
                      if (userInput == 'Hi') {
                        textMessage(senderID, "Welcome Reader").then(() => {
                          QuickReplyUserMenu(senderID);
                        })

                      }
                    
                      if (userQuickreply == 'searchbook') {
                        console.log("Searchhh", userInput);
                        SearchBook(senderID);
                      }
                      if (userQuickreply == 'recommendbook') {
                        Specific(senderID);
                      }
                      if (userQuickreply == 'becomereviwer') {
                        ReviewerTest(senderID);
                      }                      
                       else if (userInput == 'bytyping') {
                        //bybookname = userInput;
                        currentUser.bybookname = userInput;
                        textMessage(senderID,"Please Type BookName!");
                      }
                       else if (userMessage !== undefined && currentUser.bybookname == 'bytyping') {
                        console.log("UserMessage_searchtype", userMessage);
                        currentUser.bybookname = '';                        
                        SearchByTyping(senderID, userMessage);
                      }
                      else if (userInput == 'byauthor') {
                        currentUser.byauthor = userInput;
                        textMessage(senderID,"Please Type Author name!");
                        console.log("SearchType", currentUser.byauthor);
                      }
                      else if (userMessage !== undefined && currentUser.byauthor == 'byauthor') {
                        console.log("UserMessage_searchtype", userMessage);
                        currentUser.byauthor = '';

                        SearchByAuthor(senderID, userMessage);
                      }
                      else if (userInput == 'video') {
                        textMessage(senderID,"Please Type Facebook Video Link");
                       currentUser.uploadvideo = userInput;
                      }
                      else if (userMessage !== undefined && currentUser.uploadvideo == 'video') {
                        console.log("UserMessagevideo", userMessage);
                        //console.log("UM",userMessage);
                        VideoUpload(senderID, userMessage).then(success => {
                          textMessage(senderID, "Upload Successful").then(ok => {
                            QuickReplyUserMenu(senderID);
                          })
                        })
                        currentUser.uploadvideo = '';

                      }

                      if (userInput == 'byhobby') {
                        QuickReplyHobbies(senderID);
                      }
                      if (userQuickreply == 'normal') {
                        Normal(senderID);
                      }
                      if (userQuickreply == 'specific') {
                        Specific(senderID);
                      }
                       if(userInput != undefined && userInput.includes('bookreviewlist'))
                  {
                    var reviwerbookname = userInput.split('#');
                    var dataarray = reviwerbookname[1];
                    RetrieveVideo(senderID,dataarray).then(aaa=>{
                      QuickReplyUserMenu(senderID);
                    })

                  }
                      if (userInput.includes('normalbookshop')) {
                        var bk = userInput.split('#');
                        var bookname = bk[1];
                        var image = bk[2];
                        console.log(bookname);
                        db.collection('book').doc(bookname).collection('bookshop').get().then(bklist => {
                          bklist.forEach((doc) => {
                            requestify.post(sendmessageurl,
                              {
                                "recipient": {
                                  "id": senderID
                                },
                                "message": {
                                  "attachment": {
                                    "type": "template",
                                    "payload": {
                                      "template_type": "generic",
                                      "elements": [
                                        {
                                          "title": bookname,
                                          "subtitle": doc.id,
                                          "image_url": image,
                                          "buttons": [
                                            {
                                              "type": "postback",
                                              "title": "Book Shop Info",
                                              "payload": `bookshopinfo#${doc.id}#${bookname}`
                                            }
                                          ]
                                        }

                                      ]
                                    }
                                  }
                                }
                              })

                          })
                        })

                      }
                      if (userInput.includes('specificbookshop')) {
                        var bk = userInput.split('#');
                        var bookname = bk[1];
                        var image = bk[2];
                        console.log(bookname);
                        db.collection('book').doc(bookname).collection('bookshop').get().then(bklist => {
                          bklist.forEach((doc) => {
                            requestify.post(sendmessageurl,
                              {
                                "recipient": {
                                  "id": senderID
                                },
                                "message": {
                                  "attachment": {
                                    "type": "template",
                                    "payload": {
                                      "template_type": "generic",
                                      "elements": [
                                        {
                                          "title": bookname,
                                          "subtitle": doc.id,
                                          "image_url": image,
                                          "buttons": [
                                            {
                                              "type": "postback",
                                              "title": "Book Shop Info",
                                              "payload": `bookshopinfo#${doc.id}#${bookname}`
                                            }
                                          ]
                                        }

                                      ]
                                    }
                                  }
                                }
                              })

                          })
                        })

                      }
                      if (userInput == 'instruction') {
                        MessageDetail(senderID, "Step 1", "Please Upload Video").then(() => {
                          QuickReplyUserMenu(senderID);
                        })
                      }
                      if (userInput.includes('bookshopinfo')) {
                        var bookshoppayload = userInput.split('#');
                        var bookshopname = bookshoppayload[1];
                        var bookname = bookshoppayload[2];

                        db.collection('book').doc(bookname).collection('bookshop').get().then(bslist => {
                          bslist.forEach((doc) => {
                            if (doc.id == bookshopname) {
                              MessageDetail(senderID, "Book Name", bookname).then(() => {
                                MessageDetail(senderID, "Book Shop Name", bookshopname).then(() => {
                                  MessageDetail(senderID, "Stock", doc.data().stock).then(() => {
                                    MessageDetail(senderID, "Book Shop Address", doc.data().bookshopaddress).then(() => {
                                      MessageDetail(senderID, "Book Shop Phone", doc.data().bookshopphno).then(() => {
                                        MessageDetail(senderID, "Page Link", doc.data().link).then(()=>{
                                        QuickReplyUserMenu(senderID)
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            }
                          })
                        })


                      }

                      if (userInput !== undefined && userInput.includes('authorbkdetail')) {
                        var result = userInput.split('#');
                        var bookname = result[1];
                        var imageUrl = result[2];
                        var zero = result[0];
                        console.log(userInput);
                        console.log('zero', result[0]);
                        console.log('one', result[1]);
                        console.log('two'), result[2];
                        var authorownbook = [];
                        db.collection('book').doc(bookname).collection('bookshop').get().then(authorbkshoplist => {
                          authorbkshoplist.forEach((doc) => {
                            let data = {
                              "title": "BookName : " + bookname,
                              "subtitle": "Book Shop : " + doc.id,
                              "image_url": imageUrl,
                              "buttons": [
                                {
                                  "type": "postback",
                                  "title": "Book Shop Address",
                                  "payload": `authoraddress#${doc.id}#${bookname}`
                                }
                              ]
                            }
                            authorownbook.push(data);
                          })


                          requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
                            {
                              "recipient": {
                                "id": senderID
                              },
                              "message": {
                                "attachment": {
                                  "type": "template",
                                  "payload": {
                                    "template_type": "generic",
                                    "elements": authorownbook
                                  }
                                }
                              }
                            }).catch((err) => {
                              console.log('Error getting documents', err);
                            });


                        })


                      }
                      if (userInput.includes('authoraddress')) {
                        var authbookresult = userInput.split('#');
                        var bookshopname = authbookresult[1];
                        var bookname = authbookresult[2];
                        console.log(bookname);
                        console.log(bookshopname);
                        db.collection('book').doc(bookname).collection('bookshop').get().then(bslist => {
                          bslist.forEach((doc) => {
                            if (doc.id == bookshopname) {
                              MessageDetail(senderID, "Book Name", bookname).then(() => {
                                MessageDetail(senderID, "Book Shop Name", bookshopname).then(() => {
                                  MessageDetail(senderID, "Stock", doc.data().stock).then(() => {
                                    MessageDetail(senderID, "Book Shop Address", doc.data().bookshopaddress).then(() => {
                                      MessageDetail(senderID, "Book Shop Phone", doc.data().bookshopphno).then(() => {
                                        MessageDetail(senderID, "Page Link", doc.data().link).then(()=>{
                                        QuickReplyUserMenu(senderID)
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            }
                          })
                        })


                      }
                      if (userInput !== undefined && userInput.includes('bokdetail')) {
                        var result = userInput.split('#');
                        var bookshopname = result[1];
                        var bookname = result[2];

                        db.collection('book').doc(bookname).collection('bookshop').get().then(bookshoplist => {
                          bookshoplist.forEach((doc) => {
                            if (doc.id == bookshopname) {
                              MessageDetail(senderID, "Book Name", bookname).then(() => {
                                MessageDetail(senderID, "Book Shop Name", bookshopname).then(() => {
                                  MessageDetail(senderID, "Stock", doc.data().stock).then(() => {
                                    MessageDetail(senderID, "Book Shop Address", doc.data().bookshopaddress).then(() => {
                                      MessageDetail(senderID, "Book Shop Phone", doc.data().bookshopphno).then(() => {
                                        MessageDetail(senderID, "Page Link", doc.data().link).then(()=>{
                                        QuickReplyUserMenu(senderID)
                                        })
                                      })
                                    })
                                  })
                                })
                              })
                            }
                          })
                        })

                      }

                      //#endregion      

                    }
                  })

                }
                else {
                  // #region Reviewer
                  if (userInput == 'Hi') {
                    textMessage(senderID, "Welcome Reviewer").then(() => {
                      QuickReplyReviewerMenu(senderID);
                    })
                  }
               
                  if (userQuickreply == 'searchbook') {
                    console.log("Searchhh", userInput);
                    SearchBook(senderID);
                  }
                  if (userQuickreply == 'recommendbook') {
                    Specific(senderID);
                  }
                  else if (userInput == 'bytyping') {
                    currentUser.bybookname = userInput;
                     textMessage(senderID,"Please Type Book Name!")
                    // textMessage(senderID,"Please Type BookName!");
                    console.log("SearchType",currentUser.bybookname);

                  }
                  else if (userMessage !== undefined && currentUser.bybookname == 'bytyping') {
                    console.log("UserMessage_searchtype", userMessage);
                    currentUser.bybookname = '';

                    SearchByTypingR(senderID, userMessage);
                  }
                  else if (userInput == 'byauthor') {
                    byauthor = userInput;
                    textMessage(senderID,"Please Type Author Name!");
                    console.log("SearchType", byauthor);

                  }
                  else if (userMessage !== undefined && byauthor == 'byauthor') {
                    console.log("UserMessage_searchtype", userMessage);
                    byauthor = '';

                    SearchByAuthorR(senderID, userMessage);
                  }
                  if (userInput !== undefined && userInput.includes('upvideo')) {
                    var upvideoarray = userInput.split('#');
                    upvideobookname = upvideoarray[1];
                   currentUser.bookname = upvideobookname;
                   // upvideoum = 'ok';
                    currentUser.upvideoum = 'ok';
                    textMessage(senderID,"PLease Type your video Link!")
                  }
                  if (userMessage !== undefined &&  currentUser.upvideoum === 'ok') {
                    console.log("UserMessageReviewer", userMessage);
                     UploadVideoByReviewer(senderID,currentUser.bookname,userMessage)
                    currentUser.upvideoum = '';
                    currentUser.bookname='';
                  }

                  if(userInput != undefined && userInput.includes('bookreviewlist'))
                  {
                    var reviwerbookname = userInput.split('#');
                    var dataarray = reviwerbookname[1];
                    RetrieveVideo(senderID,dataarray).then(aaa=>{
                      QuickReplyReviewerMenu(senderID);
                    })

                  }

                  if (userInput == 'byhobby') {
                    QuickReplyHobbies(senderID);
                  }
                  if (userQuickreply == 'normal') {
                    Normal(senderID);
                  }
                  if (userQuickreply == 'specific') {
                    Specific(senderID);
                  }
                  if (userInput.includes('normalbookshop')) {
                    var bk = userInput.split('#');
                    var bookname = bk[1];
                    var image = bk[2];
                    console.log(bookname);
                    db.collection('book').doc(bookname).collection('bookshop').get().then(bklist => {
                      bklist.forEach((doc) => {
                        requestify.post(sendmessageurl,
                          {
                            "recipient": {
                              "id": senderID
                            },
                            "message": {
                              "attachment": {
                                "type": "template",
                                "payload": {
                                  "template_type": "generic",
                                  "elements": [
                                    {
                                      "title": bookname,
                                      "subtitle": doc.id,
                                      "image_url": image,
                                      "buttons": [
                                        {
                                          "type": "postback",
                                          "title": "Book Shop Info",
                                          "payload": `bookshopinfo#${doc.id}#${bookname}`
                                        }
                                      ]
                                    }

                                  ]
                                }
                              }
                            }
                          })

                      })
                    })

                  }
                  if (userInput.includes('specificbookshop')) {
                    var bk = userInput.split('#');
                    var bookname = bk[1];
                    var image = bk[2];
                    console.log(bookname);
                    db.collection('book').doc(bookname).collection('bookshop').get().then(bklist => {
                      bklist.forEach((doc) => {
                        requestify.post(sendmessageurl,
                          {
                            "recipient": {
                              "id": senderID
                            },
                            "message": {
                              "attachment": {
                                "type": "template",
                                "payload": {
                                  "template_type": "generic",
                                  "elements": [
                                    {
                                      "title": bookname,
                                      "subtitle": doc.id,
                                      "image_url": image,
                                      "buttons": [
                                        {
                                          "type": "postback",
                                          "title": "Book Shop Info",
                                          "payload": `bookshopinfo#${doc.id}#${bookname}`
                                        }
                                      ]
                                    }

                                  ]
                                }
                              }
                            }
                          })

                      })
                    })

                  }
                  if (userInput.includes('bookshopinfo')) {
                    var bookshoppayload = userInput.split('#');
                    var bookshopname = bookshoppayload[1];
                    var bookname = bookshoppayload[2];

                    db.collection('book').doc(bookname).collection('bookshop').get().then(bslist => {
                      bslist.forEach((doc) => {
                        if (doc.id == bookshopname) {
                          MessageDetail(senderID, "Book Name", bookname).then(() => {
                            MessageDetail(senderID, "Book Shop Name", bookshopname).then(() => {
                              MessageDetail(senderID, "Stock", doc.data().stock).then(() => {
                                MessageDetail(senderID, "Book Shop Address", doc.data().bookshopaddress).then(() => {
                                  MessageDetail(senderID, "Book Shop Phone", doc.data().bookshopphno).then(() => {
                                    MessageDetail(senderID, "Page Link", doc.data().link).then(() => {
                                      QuickReplyReviewerMenu(senderID)
                                    })
                                  })
                                })
                              })
                            })
                          })
                        }
                      })
                    })
                  }

                  if (userInput !== undefined && userInput.includes('authorbkdetail')) {
                    var result = userInput.split('#');
                    var bookname = result[1];
                    var imageUrl = result[2];
                    var zero = result[0];
                    console.log(userInput);
                    console.log('zero', result[0]);
                    console.log('one', result[1]);
                    console.log('two'), result[2];
                    var authorownbook = [];
                    db.collection('book').doc(bookname).collection('bookshop').get().then(authorbkshoplist => {
                      authorbkshoplist.forEach((doc) => {
                        let data = {
                          "title": "BookName : " + bookname,
                          "subtitle": "Book Shop : " + doc.id,
                          "image_url": imageUrl,
                          "buttons": [
                            {
                              "type": "postback",
                              "title": "Book Shop Address",
                              "payload": `authoraddress#${doc.id}#${bookname}`
                            }
                          ]
                        }
                        authorownbook.push(data);
                      })


                      requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
                        {
                          "recipient": {
                            "id": senderID
                          },
                          "message": {
                            "attachment": {
                              "type": "template",
                              "payload": {
                                "template_type": "generic",
                                "elements": authorownbook
                              }
                            }
                          }
                        }).catch((err) => {
                          console.log('Error getting documents', err);
                        });


                    })


                  }
                  if (userInput.includes('authoraddress')) {
                    var authbookresult = userInput.split('#');
                    var bookshopname = authbookresult[1];
                    var bookname = authbookresult[2];
                    console.log(bookname);
                    console.log(bookshopname);
                    db.collection('book').doc(bookname).collection('bookshop').get().then(bslist => {
                      bslist.forEach((doc) => {
                        if (doc.id == bookshopname) {
                          MessageDetail(senderID, "Book Name", bookname).then(() => {
                            MessageDetail(senderID, "Book Shop Name", bookshopname).then(() => {
                              MessageDetail(senderID, "Stock", doc.data().stock).then(() => {
                                MessageDetail(senderID, "Book Shop Address", doc.data().bookshopaddress).then(() => {
                                  MessageDetail(senderID, "Book Shop Phone", doc.data().bookshopphno).then(() => {
                                    MessageDetail(senderID, "Page Link", doc.data().link).then(() => {
                                    QuickReplyReviewerMenu(senderID)
                                    })
                                  })
                                })
                              })
                            })
                          })
                        }
                      })
                    })


                  }
                  if (userInput !== undefined && userInput.includes('bokdetail')) {
                    var result = userInput.split('#');
                    var bookshopname = result[1];
                    var bookname = result[2];

                    db.collection('book').doc(bookname).collection('bookshop').get().then(bookshoplist => {
                      bookshoplist.forEach((doc) => {
                        if (doc.id == bookshopname) {
                          MessageDetail(senderID, "Book Name", bookname).then(() => {
                            MessageDetail(senderID, "Book Shop Name", bookshopname).then(() => {
                              MessageDetail(senderID, "Stock", doc.data().stock).then(() => {
                                MessageDetail(senderID, "Book Shop Address", doc.data().bookshopaddress).then(() => {
                                  MessageDetail(senderID, "Book Shop Phone", doc.data().bookshopphno).then(() => {
                                    MessageDetail(senderID, "Page Link", doc.data().link).then(()=>{
                                    QuickReplyReviewerMenu(senderID)
                                    })
                                  })
                                })
                              })
                            })
                          })
                        }
                      })
                    })

                  }
                  //#endregion
                } 
              })


            }
            else {
              //#region seller
              console.log('USER INPUT -> ', userInput);
              if (userInput == 'Hi') {
                textMessage(senderID,"Welcome Book Seller").then(sell=>{
                  QuickReplyMenu(senderID);
                })
               
              }
              if (userQuickreply == 'menu') {
                BookshopMenu(senderID);
              }

              if (userInput == 'booklist') {
              	console.log("dsafdsafdsfds",userInput)
              		Get_BookList(senderID);
              		console.log("get book list");
              
              }
              if (userMessage == 'Login') {
                QuickReplyMenu(senderID);

              }

              if (userInput !== undefined && userInput.includes('book_detail')) {

                // let result = userInput.substring(12);
                // console.log("substring",result);
                var bookdetail = userInput.split('#');
                var author = bookdetail[2];
                var bookname = bookdetail[1];
                console.log("Author", author);
                console.log("Bookname", bookname);
                console.log("SenderID", senderID);
                db.collection('book').doc(bookname).collection('bookshop').get().then(bookshoplist => {
                  bookshoplist.forEach((doc) => {
                    if (doc.data().ownerid == senderID) {
                      MessageDetail(senderID, "Book Name", bookname).then(() => {
                        MessageDetail(senderID, "Author", author).then(() => {
                          MessageDetail(senderID, "Stock", doc.data().stock).then(() => {
                            MessageDetail(senderID, "Book Shop Address", doc.data().bookshopaddress).then(() => {
                              MessageDetail(senderID, "Book Shop Phone", doc.data().bookshopphno).then(() => {
                                MessageDetail(senderID, "Page Link", doc.data().link).then(() =>{
                                  QuickReplyMenu(senderID)
                                })
                              })
                            })
                          })
                        })
                      })
                    }
                  })
                })


              }
            }
          })

          //#endregion
        }

        else {

          //#region admin
          if (userInput == 'Hi') {
            textMessage(senderID, "Welcome Admin").then(admin => {
              QuickReplyAdminMenu(senderID);
            })

          }
          if (userQuickreply == 'reviewerapplicationlist') {
            
            let correct = [];
            let checkwork = 'before';
            db.collection('testingreviewer').get().then(kiki=>{
                                        kiki.forEach(doc=>{
                                        correct.push(doc.data().isreviewer)                                        
                           })

                     if(correct.includes(checkwork))
                     {
                      ApplicationList(senderID)
                     }
                     else 
                     {
                      textMessage(senderID,"Thanks!There are no applicants left").then(apr=>{
                        QuickReplyAdminMenu(senderID);
                      })
                     }
                   })
            
          }
          if (userInput == 'reviewerapplicationlist') {
            ApplicationList(senderID);
          }
          if (userInput != undefined && userInput.includes('realaccept')) {
            var acceptreviwerarray = userInput.split('#');
            var docid = acceptreviwerarray[1];
            var userid = acceptreviwerarray[2];
            var condition ='normal';
            console.log("DOcid", docid);
            console.log("Userid", userid)
            AcceptArray(senderID, docid, userid).then(ok => {
              ApplicationList(senderID)
                })
                  db.collection('testingreviewer').get().then(ooooo=>{
                                        ooooo.forEach(doc=>{
                                          if(doc.data().isreviewer == 'no')
                                          {
                                            condition = 'no'
                                          }
                                          else if (doc.data().isreviewer == 'yes')
                                          {
                                            condition = 'no'
                                          }
                                        })

                                    if(condition == 'no')
                                    {
                                      QuickReplyAdminMenu(senderID);
                                    }
                           })
           
          }
          if (userInput != undefined && userInput.includes('decline')) {
            var declineviwerarray = userInput.split('#');
            var docid = declineviwerarray[1];
            var userid = declineviwerarray[2];
            console.log("DOcid", docid);
            console.log("Userid", userid)
            let correct='normal';
                      DeclineArray(senderID, docid, userid).then(oki => {
                      ApplicationList(senderID)
                       });
                           db.collection('testingreviewer').get().then(kkk=>{
                                        kkk.forEach(doc=>{
                                          if(doc.data().isreviewer == 'no')
                                          {
                                            correct = 'no'
                                          }
                                          else if (doc.data().isreviewer == 'yes')
                                          {
                                            correct = 'no'
                                          }
                                        })

                                    if(correct == 'no')
                                    {
                                      QuickReplyAdminMenu(senderID);
                                    }
                           })

           
             
          }
          if (userInput != undefined && userInput.includes('openvideo')) {
            var videoinput = userInput.split('#');
            var datauserid = videoinput[1];
            db.collection('testingreviewer').where('isreviewer', '==', 'before').get().then(videolist => {
              videolist.forEach(doc => {
                if (doc.data().userid == datauserid) {
                  requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
                    {
                      "recipient": {
                        "id": senderID
                      },
                      "message": {
                        "attachment": {
                          "type": "template",
                          "payload": {
                            "template_type": "media",
                            "elements": [
                              {
                                "media_type": "video",
                                "url": doc.data().videolink,
                                "buttons": [
                                  {
                                    "type": "postback",
                                    "title": "Accept",
                                    "payload": `realaccept#${doc.id}#${datauserid}`
                                  },
                                  {
                                    "type": "postback",
                                    "title": "Decline",
                                    "payload": `decline#${doc.id}#${datauserid}`
                                  }
                                ]
                              }
                            ]
                          }
                        }
                      }



                    }).catch((err) => {
                      console.log('Error getting documents', err);
                    });

                }
              })
            })
          }
          //#endregion
        }
      })




    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});
//app
app.get('/register_books/:sender_id', function (req, res) {
  const sender_id = req.params.sender_id;
  res.render('testing.ejs', { title: "Please Register Books", sender_id: sender_id });
});

// app.get('/add-whitelist', (req, res) => {
//   whitelistDomains(res);
// });

app.get('/removePersistentMenu',function(req,res){
	removePersistentMenu(res);
})

app.post('/register_books', async (req, res) => {
  let author = req.body.author;
  let bookname = req.body.bookname;
  let bookshopname = req.body.bookshopname;
  let sender = req.body.sender;
  let image = req.body.image;
  let bookshopaddress = req.body.bookshopaddress;
  let bookshopphno = req.body.bookshopphno;
  let link = req.body.link;
  let stock = req.body.stock;
  let knowledge = '';
  let romance = '';
  let history = '';
  let biography = '';
  let religion = '';
  var genre = [];
  var ownerlist = [];
  var ownerid=[];
  var bblist =[];
  var value='a';
  let currentUser=null;

   
  if (req.body.knowledge) {
    knowledge = req.body.knowledge;
    genre.push(knowledge);
  }
  if (req.body.romance) {
    romance = req.body.romance;
    genre.push(romance);
  }
  if (req.body.religion) {
    religion = req.body.religion;
    genre.push(religion);
  }
  if (req.body.history) {
    history = req.body.history;
    genre.push(history);
  }
  if (req.body.biography) {
    biography = req.body.biography;
    genre.push(biography);
  }
  currentUser = userSessions.find(user => user.id === sender);
      if (!currentUser) { // if the user is new
        currentUser = newUser(sender);
        userSessions.push(currentUser);
      }
   ownerid.push(sender);
    console.log("BookName",bookname);
    console.log("sender",sender);
    console.log("BookshopName",bookshopname);

     //  var a = db.collection('book').doc(bookname);
     // var arrUnion= a.update({
     //  owner : admin.firestore.FieldValue.arrayUnion(sender)
     // });

     // db.collection('book').doc(bookname).collection('bookshop').get().then(emptybookshop=>{
     //   emptybookshop.forEach(doc=>{
     //        if(doc.data().ownerid == sender)
     //        {
     //          textMessage(sender,"This is duplicate input");
     //        }
     //   })
     // })
     var owneridlist=[];
     db.collection("book").doc(bookname).collection("bookshop").get().then(bn=>{
      bn.forEach(doc=>{
         owneridlist.push(doc.data().ownerid);
      })
      if(owneridlist.includes(sender))
      {
          currentUser.ownercondition = "yes";
      }
      else 
      {
          currentUser.ownercondition = "no";
      }
     })

    
    db.collection('book').get().then(po=>{
      po.forEach(doc=>{
        bblist.push(doc.id);
      })
      if(bblist.includes(bookname && currentUser.ownercondition == "no"))      {  

       // have book
           var a = db.collection('book').doc(bookname);
           var arrUnion= a.update({
            owner : admin.firestore.FieldValue.arrayUnion(sender)
           })
        db.collection("book").doc(bookname).collection("bookshop").doc(bookshopname).set({
            bookshopaddress: bookshopaddress,
            bookshopphno: bookshopphno,
            link: link,
            ownerid: sender,
            stock: stock
          }).then(bo=>{
            textMessage(sender,"Register Successful!");
          })
      }
      else if (bblist.includes(bookname) && currentUser.ownercondition == "yes")
      {
          db.collection('book').doc(bookname).collection('bookshop').get().then(emptybookshop=>{
       emptybookshop.forEach(doc=>{
            if(doc.data().ownerid == sender)
            {
              textMessage(sender,"This is duplicate Registery");
            }
       })
     })
      }
      else
      {
               db.collection("book").doc(bookname).set(  
            {
              author: author,
              genre: genre,
              image: image,
              owner:ownerid
            })
          db.collection("book").doc(bookname).collection("bookshop").doc(bookshopname).set({
            bookshopaddress: bookshopaddress,
            bookshopphno: bookshopphno,
            link: link,
            ownerid: sender,
            stock: stock
          }).then(boo=>{
            textMessage(sender,"Register Successful!");
          })
      }
    })


  // send, sendFile, redirect
  res.redirect('https://www.messenger.com/closeWindow');
})





app.get('/edit_book/:sender_id/:bookname/:author', function (req, res) {
  const sender_id = req.params.sender_id;
  const bookname = req.params.bookname;
  const author = req.params.author;
  var bookshopname = '';
  var bookshopaddress = '';
  var bookshopphno = '';
  var stock = '';
  var link = '';

  db.collection('book').doc(bookname).collection('bookshop').get().then(bookshopdetail => {
    bookshopdetail.forEach(doc => {
      if (doc.data().ownerid == sender_id) {
        bookshopname = doc.id;
        bookshopaddress = doc.data().bookshopaddress;
        bookshopphno = doc.data().bookshopphno;
        stock = doc.data().stock;
        link = doc.data().link;
      }
    })
    console.log("Bookshopname", bookshopname);
    res.render('edit_book.ejs', { title: "Please Modify following book", sender_id: sender_id, bookname: bookname, author: author, bookshopname: bookshopname, bookshopaddress: bookshopaddress, bookshopphno: bookshopphno, link: link, stock: stock });
  })

})


app.post('/edit_book', (req, res) => {
  console.log("received");
  let bookname = req.body.bookname;
  let bookshopname = req.body.bookshopname;
  let sender = req.body.sender;
  let author = req.body.author;
  let bookshopaddress = req.body.bookshopaddress;
  let bookshopphno = req.body.bookshopphno;
  let stock = req.body.stock;
  let link = req.body.link;

  return db.collection('book').doc(bookname).collection('bookshop').doc(bookshopname).set({
    bookshopaddress: bookshopaddress,
    bookshopphno: bookshopphno,
    stock: stock,
    link: link,
    ownerid: sender
  }).then(success => {
    textMessage(sender, "Update Successful").then(io=>{
      QuickReplyMenu(sender);
    })
      res.redirect('https://www.messenger.com/closeWindow');
    //res.status(200).send("Update Successful and Please go back to your messages and please check your book detail");
    // window.location.assign('https://www.messenger.com/closeWindow/?image_url=https://secure.i.telegraph.co.uk/multimedia/archive/03058/thankyou-interest_3058089c.jpg&display_text=Thanks');
  }).catch(error => {
    console.log(error);
  })

})





app.get('/register_user/:sender_id', function (req, res) {
  const sender_id = req.params.sender_id;
  db.collection("user").where('userid', '==', `${sender_id}`).get().then(userlist => {
    if (userlist.empty) {
      res.render('register_user.ejs', { title: "Please Register User", sender_id: sender_id });
    }
    else {
      res.redirect('https://www.messenger.com/closeWindow');
    }
  })

});


app.post('/register_user', (req, res) => {
  let email = req.body.email;
  let sender = req.body.sender;
  let isreviewer = "false";
  var genre = [];



  if (req.body.knowledge) {
    var knowledge = req.body.knowledge;
    genre.push(knowledge);
  }
  if (req.body.romance) {
    var romance = req.body.romance;
    genre.push(romance);
  }
  if (req.body.religion) {
    var religion = req.body.religion;
    genre.push(religion);
  }
  if (req.body.history) {
    var history = req.body.history;
    genre.push(history);
  }
  if (req.body.biography) {
    var biography = req.body.biography;
    genre.push(biography);
  }
  console.log("Gerence", genre);


  ///
  // requestify

  // res.render('success.ejs', {}); TODO: show success page


  db.collection('user').add({
    email: email,
    hobby: genre,
    isreviewer: isreviewer,
    userid: sender
  }).then(success => {
   textMessage(sender,"Register Successful").then(()=>{
   	  QuickReplyUserMenu(sender)
   })

    // window.location.assign('https://www.messenger.com/closeWindow/?image_url=https://secure.i.telegraph.co.uk/multimedia/archive/03058/thankyou-interest_3058089c.jpg&display_text=Thanks');
  }).catch(error => {
    console.log(error);
  });
  res.redirect('https://www.messenger.com/closeWindow');
})

//Function
function textMessage(senderID, text) {
  return requestify.post(sendmessageurl, {
    "recipient": {
      "id": senderID
    },
    "message": {
      "text": text
    }
  })
}

function QuickReplyMenu(senderID) {
  return requestify.post(sendmessageurl,
    {
      "recipient": {
        "id": senderID
      },

      "message": {
        "text": "Tap Menu",
        "quick_replies": [
          {
            "content_type": "text",
            "title": "Menu",
            "payload": "menu"
          }
        ]
      }
    }).then(result => {
      console.log("ok")
    }).catch(err => { console.log("err", err) })
}


function QuickReplyUserMenu(senderID) {
  return requestify.post(sendmessageurl,
    {
      "recipient": {
        "id": senderID
      },

      "message": {
        "text": "Reader Menu",
        "quick_replies": [
          {
            "content_type": "text",
            "title": "Search Book",
            "payload": "searchbook"
          },
          {
            "content_type": "text",
            "title": "Recommend Book",
            "payload": "recommendbook"
          },
          {
            "content_type": "text",
            "title": "Become Reviewer ?",
            "payload": "becomereviwer"
          }
        ]
      }
    }).then(result => {
      console.log("ok")
    }).catch(err => { console.log("err", err) })
}


function QuickReplyReviewerMenu(senderID) {
  return requestify.post(sendmessageurl,
    {
      "recipient": {
        "id": senderID
      },

      "message": {
        "text": "Please Choose User Menu",
        "quick_replies": [
          {
            "content_type": "text",
            "title": "Search Book",
            "payload": "searchbook"
          },
          {
            "content_type": "text",
            "title": "Recommend Book",
            "payload": "recommendbook"
          }
        ]
      }
    }).then(result => {
      console.log("ok")
    }).catch(err => { console.log("err", err) })
}


function QuickReplyNewUser(senderID) {
  requestify.post(sendmessageurl,
    {
      "recipient": {
        "id": senderID
      },

      "message": {
        "text": "Book Reader or Book Seller?",
        "quick_replies": [
          {
            "content_type": "text",
            "title": "Book Reader",
            "payload": "reader"
          },
          {
            "content_type": "text",
            "title": "Book Seller",
            "payload": "seller"
          }

        ]
      }
    }).then(result => {
      console.log("ok")
    }).catch(err => { console.log("err", err) })
}


function MessageDetail(senderID, prefix, text) {
  console.log('MESSENGER_DETAIL');
  return requestify.post(sendmessageurl, {
    "recipient": {
      "id": senderID
    },
    "message": {
      "text": prefix + " : " + text
    }
  })
}

function BookshopMenu(senderID) {
  requestify.post(sendmessageurl,
    {
      "recipient": {
        "id": senderID
      },
      "message": {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": "Book Seller Menu",
                "subtitle": "Choose One Menu",
                "buttons": [
                  {
                    "type": "web_url",
                    "url": "https://kusharphat.herokuapp.com/register_books/" + senderID,
                    "title": "Selling Books",
                    "webview_height_ratio": "full"
                  },
                  {
                    "type": "postback",
                    "title": "Your Books List",                  
                    "payload": "booklist"
                  },
                ]
              }

            ]
          }
        }
      }
    })
  console.log('button_sender', senderID);
}

function Get_BookList(senderID) {

  let bookdetail = [];

  return db.collection('book').where('owner', 'array-contains', senderID).get().then(async (booklist) => {
    booklist.forEach(doc => {
      let data = {
        "title": "BookName : " + doc.id,
        "subtitle": "Author : " + doc.data().author,
        "image_url": doc.data().image,
        "buttons": [
          {
            "type": "postback",
            "title": "Your Book Selling Info",
            "payload": `book_detail#${doc.id}#${doc.data().author}`
          },
          {
            "type": "web_url",
            "url": "https://kusharphat.herokuapp.com/edit_book/" + senderID + "/" + doc.id + "/" + doc.data().author,
            "title": "Edit Selling Info",
            "webview_height_ratio": "full"
          },

        ]
      }

      bookdetail.push(data)

    })

    await requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
      {
        "recipient": {
          "id": senderID
        },
        "message": {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": bookdetail
            }
          }
        }
      }).catch((err) => {
        console.log('Error getting documents', err);
      });
  })


}

function UserRegister(senderID, userMessage) {
  requestify.post(sendmessageurl,
    {
      "recipient": {
        "id": senderID
      },
      "message": {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": "Please Click Register",
                "subtitle": "",
                "buttons": [
                  {
                    "type": "web_url",
                    "url": "https://kusharphat.herokuapp.com/register_user/" + senderID,
                    "title": "Register",
                    "webview_height_ratio": "full"
                  }
                ]
              }

            ]
          }
        }
      }
    })
  console.log('button_sender', senderID);
}


function SearchBook(senderID) {
  requestify.post('https://graph.facebook.com/v2.6/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
    {
      "recipient": {
        "id": senderID
      },
      "message": {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": "**Please type after choosing menu**",
                "subtitle": "Please Choose Menu",
                "buttons": [
                  {
                    "type": "postback",
                    "payload": "bytyping",
                    "title": "By BookName",
                    "webview_height_ratio": "full"
                  },
                  {
                    "type": "postback",
                    "payload": "byauthor",
                    "title": "By Author",
                    "webview_height_ratio": "full"
                  },
                  {
                    "type": "postback",
                    "payload": "byhobby",
                    "title": "By Hobbies",
                    "webview_height_ratio": "full"
                  },
                ]
              }

            ]
          }
        }
      }
    })

}


async function QuickReplyAdminMenu(senderID) {
  await requestify.post(sendmessageurl,
    {
      "recipient": {
        "id": senderID
      },

      "message": {
        "text": "Menu",
        "quick_replies": [
          {
            "content_type": "text",
            "title": "View Applicants",
            "payload": "reviewerapplicationlist"
          }
        ]
      }
    }).then(result => {
      console.log("ok")
    }).catch(err => { console.log("err", err) })

}

function SearchByTyping(senderID, userMessage) {
  var imageUrl = '';
  var author = '';
  var stockno = 1;
  var emptybook = false;
  var book = [];
  var bkdetail = [];

  db.collection('book').get().then(booklist => {
    booklist.forEach(doc => {
      book.push(doc.id);
      if (doc.id == userMessage) {
        imageUrl = doc.data().image;
        author = doc.data().author;
      }
    })
    console.log("book", book);
    if (book.includes(userMessage)) {
      emptybook = true;
    }


    if (emptybook == false) {
      textMessage(senderID, "Book Not Found").then(bnf=>{
        QuickReplyUserMenu(senderID);
      })
    }
    else if (emptybook == true) {
      db.collection('book').doc(userMessage).collection('bookshop').get().then(bookshop => {
        bookshop.forEach(doc => {

          let data = {
            "title": "BookName : " + userMessage,
            "subtitle": "Author : " + author,
            "image_url": imageUrl,
            "buttons": [
              {
                "type": "postback",
                "title": doc.id,
                "payload": `bokdetail#${doc.id}#${userMessage}`
              },
              {
                "type": "postback",
                "title": "Book Review List",
                "payload": `bookreviewlist#${userMessage}`
              }


            ]
          }
          bkdetail.push(data);

        })

        requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token='+PAGE_ACCESS_TOKEN,
          {
            "recipient": {
              "id": senderID
            },
            "message": {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements": bkdetail
                }
              }
            }
          }).catch((err) => {
            console.log('Error getting documents', err);
          });
      })


    }
  })

}

function SearchByTypingR(senderID, userMessage) {
  var imageUrl = '';
  var author = '';
  var stockno = 1;
  var emptybook = false;
  var book = [];
  var bkdetail = [];

  db.collection('book').get().then(booklist => {
    booklist.forEach(doc => {
      book.push(doc.id);
      if (doc.id == userMessage) {
        imageUrl = doc.data().image;
        author = doc.data().author;
      }
    })
    console.log("Book", book);
    if (book.includes(userMessage)) {
      emptybook = true;
    }


    if (emptybook == false) {
      textMessage(senderID, "Book Not Found").then(bn=>{
        QuickReplyReviewerMenu(senderID)
      })
    }
    else if (emptybook == true) {
      db.collection('book').doc(userMessage).collection('bookshop').get().then(bookshop => {
        bookshop.forEach(doc => {

          let data = {
            "title": "BookName : " + userMessage,
            "subtitle": "Author : " + author,
            "image_url": imageUrl,
            "buttons": [
              {
                "type": "postback",
                "title": doc.id,
                "payload": `bokdetail#${doc.id}#${userMessage}`
              },
              {
                "type": "postback",
                "title": "Book Review List",
                "payload": `bookreviewlist#${userMessage}`
              },
              {
                "type": "postback",
                "title": "Upload Video",
                "payload": `upvideo#${userMessage}`
              }


            ]
          }
          bkdetail.push(data);

        })

        requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
          {
            "recipient": {
              "id": senderID
            },
            "message": {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "generic",
                  "elements": bkdetail
                }
              }
            }
          }).catch((err) => {
            console.log('Error getting documents', err);
          });
      })


    }
  })









}


function SearchByAuthor(senderID, userMessage) {
  var bookwithauthor = [];
  var checkauthoerbook = false;
  var checkauthorarray =[];

  db.collection('book').get().then(aut=>{
    aut.forEach(doc=>{
      checkauthorarray.push(doc.data().author);
    })

    if(checkauthorarray.includes(userMessage))
    {
      checkauthoerbook = true
    }
    else 
    {
      checkauthoerbook = false
    }

    if(checkauthoerbook == false)
    {
      textMessage(senderID,"Book Not Found").then(bof=>{
        QuickReplyUserMenu(senderID)
      })
    }
    else if (checkauthoerbook == true)
    {


       db.collection('book').get().then(bokau => {
    bokau.forEach(doc => {
      if (doc.data().author == userMessage) {
        let data = {
          "title": "BookName : " + doc.id,
          "subtitle": "Author : " + userMessage,
          "image_url": doc.data().image,
          "buttons": [
            {
              "type": "postback",
              "title": "Book Detail",
              "payload": `authorbkdetail#${doc.id}#${doc.data().image}`
            },
            {
              "type": "postback",
              "title": "Book Review List",
              "payload": `bookreviewlist#${doc.id}`
            }
          ]
        }

        bookwithauthor.push(data);
      }
    })
    requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
      {
        "recipient": {
          "id": senderID
        },
        "message": {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": bookwithauthor
            }
          }
        }
      }).catch((err) => {
        console.log('Error getting documents', err);
      });
  })
    }


  })


  
}

function SearchByAuthorR(senderID, userMessage)
{
  var bookwithauthor = [];
    var checkauthoerbookR = false;
  var checkauthorarrayR =[];

  db.collection('book').get().then(aut=>{
    aut.forEach(doc=>{
      checkauthorarrayR.push(doc.data().author);
    })

    if(checkauthorarrayR.includes(userMessage))
    {
      checkauthoerbookR = true
    }
    else 
    {
      checkauthoerbookR = false
    }

    if(checkauthoerbookR == false)
    {
      textMessage(senderID,"Book Not Found").then(bsof=>{
        QuickReplyReviewerMenu(senderID)
      })
    }
    else if (checkauthoerbookR == true)
    {

        db.collection('book').get().then(bokau => {
                  bokau.forEach(doc => {
                    if (doc.data().author == userMessage) {
                      let data = {
                        "title": "BookName : " + doc.id,
                        "subtitle": "Author : " + userMessage,
                        "image_url": doc.data().image,
                        "buttons": [
                          {
                            "type": "postback",
                            "title": "Book Detail",
                            "payload": `authorbkdetail#${doc.id}#${doc.data().image}`
                          },
                          {
                            "type": "postback",
                            "title": "Book Review List",
                            "payload": `bookreviewlist#${doc.id}`
                          },
                          {
                            "type": "postback",
                            "title": "Upload Video",
                            "payload": `upvideo#${doc.id}`
                          }
                        ]
                      }

                      bookwithauthor.push(data);
                    }
                  })
                      requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
                        {
                          "recipient": {
                            "id": senderID
                          },
                          "message": {
                            "attachment": {
                              "type": "template",
                              "payload": {
                                "template_type": "generic",
                                "elements": bookwithauthor
                              }
                            }
                          }
                        }).catch((err) => {
                          console.log('Error getting documents', err);
                        })
               })
    }
  })



}



function QuickReplyHobbies(senderID) {

  requestify.post(sendmessageurl,
    {
      "recipient": {
        "id": senderID
      },

      "message": {
        "text": "Please Choose Your Hobby Category",
        "quick_replies": [
          {
            "content_type": "text",
            "title": "Normal",
            "payload": "normal"
          },
          {
            "content_type": "text",
            "title": "More Specific",
            "payload": "specific"
          }
        ]
      }
    }).then(result => {
      console.log("ok")
    }).catch(err => { console.log("err", err) })

}


function Normal(senderID) {
  //var docid='a';

  let bookwithgenre = [,];
  let userwithhobby = [];
  var z;
  var row;
  var col;
  db.collection("user").where('userid', '==', `${senderID}`).get().then(hobbylist => {
    hobbylist.forEach(doc => {
      userwithhobby = doc.data().hobby;
    })

    db.collection("book").get().then(genrelist => {
      genrelist.forEach(doc => {
        if (doc !== null) {
          bookwithgenre.push({
            name: doc.id,
            image: doc.data().image,
            author: doc.data().author,
            genre: doc.data().genre // array
          });
        }
      });


      try {
        const output = bookwithgenre
          .filter(
            book => userwithhobby.some(
              gen => book.genre.includes(gen)
            )
          )
          .map(result => {
            db.collection('book').get().then(a => {
              a.forEach(doc => {
                if (doc.id == result.name) {
                  requestify.post(sendmessageurl,
                    {
                      "recipient": {
                        "id": senderID
                      },
                      "message": {
                        "attachment": {
                          "type": "template",
                          "payload": {
                            "template_type": "generic",
                            "elements": [
                              {
                                "title": doc.id,
                                "subtitle": doc.data().author,
                                "image_url": doc.data().image,
                                "buttons": [
                                  {
                                    "type": "postback",
                                    "title": "Avaliable Book Shop",
                                    "payload": `normalbookshop#${doc.id}#${doc.data().image}`
                                  },
                                   {
                                    "type": "postback",
                                    "title": "Book Review List",
                                    "payload": `bookreviewlist#${doc.id}`
                                  }
                                ]
                              }

                            ]
                          }
                        }
                      }
                    })


                }
              })
            })
          });

        console.log(output);
      } catch (e) {
        console.error(e);
      }

    })

  })
}



function Specific(senderID) {
  //var docid='a';

  let bookwithgenre = [,];
  let userwithhobby = [];
  var z;
  var row;
  var col;
  db.collection("user").where('userid', '==', `${senderID}`).get().then(hobbylist => {
    hobbylist.forEach(doc => {
      userwithhobby = doc.data().hobby;
    })

    db.collection("book").get().then(genrelist => {
      genrelist.forEach(doc => {
        if (doc !== null) {
          bookwithgenre.push({
            name: doc.id,
            image: doc.data().image,
            author: doc.data().author,
            genre: doc.data().genre // array
          });
        }
      });


      try {
        const output = bookwithgenre
          .filter(
            book => userwithhobby.every(
              gen => book.genre.includes(gen)
            )
          )
          .map(result => {
            console.log("Result Book", result);
            db.collection('book').get().then(a => {
              a.forEach(doc => {
                if (doc.id == result.name) {
                  requestify.post(sendmessageurl,
                    {
                      "recipient": {
                        "id": senderID
                      },
                      "message": {
                        "attachment": {
                          "type": "template",
                          "payload": {
                            "template_type": "generic",
                            "elements": [
                              {
                                "title": doc.id,
                                "subtitle": doc.data().author,
                                "image_url": doc.data().image,
                                "buttons": [
                                  {
                                    "type": "postback",
                                    "title": "Book Shop Address",
                                    "payload": `specificbookshop#${doc.id}#${doc.data().image}`
                                  },
                                  {
                                    "type": "postback",
                                    "title": "Book Review List",
                                    "payload": `bookreviewlist#${doc.id}`
                                  }
                                ]
                              }

                            ]
                          }
                        }
                      }
                    })


                }
              })
            })
          });

        console.log(output);
      } catch (e) {
        console.error(e);
      }

    })

  })
}

function ReviewerTest(senderID) {
  return requestify.post(sendmessageurl,
    {
      "recipient": {
        "id": senderID
      },
      "message": {
        "attachment": {
          "type": "template",
          "payload": {
            "template_type": "generic",
            "elements": [
              {
                "title": "Become Reviewer",
                "subtitle": "**Please Read Instruction First**",
                "buttons": [
                  {
                    "type": "postback",
                    "title": "Reviewer Instruction",
                    "payload": "instruction"
                  },
                  {
                    "type": "postback",
                    "title": "Upload Video Link",
                    "payload": "video"
                  },
                ]
              }

            ]
          }
        }
      }
    })
}



async function VideoUpload(senderID, userMessage) {
  var reviewerCondition = 'before';
  var email='';

 await db.collection('user').where('userid', '==', `${senderID}`).get().then(async(em)=>{
  	em.forEach(doc=>{
  		email=doc.data().email
  	})
  	await db.collection('testingreviewer').add({
  		email:email ,
  		isreviewer: reviewerCondition,
		userid: senderID,
		videolink: userMessage
  	})
  })
  console.log("UserMessage", userMessage);
}

async function ApplicationList(senderID) {
  var before = 'before';
  var isreviewerlist = [];
  let data=[];
  await db.collection('testingreviewer').where('isreviewer', '==', `${before}`).get().then(async (isreviewer) => {
    const promises=[];
    isreviewer.forEach(async (doc) => {
      promises.push(
       data = {
        "title": "email: " + doc.data().email,
        "subtitle": "",
        "buttons": [
          {
            "type": "postback",
            "title": "Open Video Link",
            "payload": `openvideo#${doc.data().userid}`
          }
         
        ]
      })
      isreviewerlist.push(data);
      

    })
    promises.push(   
     requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
      {
        "recipient": {
          "id": senderID
        },
        "message": {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": isreviewerlist
            }
          }
        }
      }).catch((err) => {
        console.log('Error getting documents', err);
      }))

      await Promise.all(promises);
  })
}

// async function ApplicationList(senderID) {
//   var before = 'before';
//   var isreviewerlist = [];
//   await db.collection('testingreviewer').where('isreviewer', '==', `${before}`).get().then(isreviewer => {
//     isreviewer.forEach(doc => {
//       let data = {
//         "title": "email: " + doc.data().email,
//         "subtitle": "",
//         "buttons": [
//           {
//             "type": "postback",
//             "title": "Open Video Link",
//             "payload": `openvideo#${doc.data().userid}`
//           }
         
//         ]
//       }
//       isreviewerlist.push(data);

//     })
//     requestify.post('https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
//       {
//         "recipient": {
//           "id": senderID
//         },
//         "message": {
//           "attachment": {
//             "type": "template",
//             "payload": {
//               "template_type": "generic",
//               "elements": isreviewerlist
//             }
//           }
//         }
//       }).catch((err) => {
//         console.log('Error getting documents', err);
//       });


//   })
// }






async function AcceptArray(senderID, docid, userid) {
  var yes = 'yes';
  var usercon = 'true';
  var userdocid = '';
  await db.collection('testingreviewer').doc(docid).set({
    isreviewer: yes
  }, { merge: true }).then(aa => {
    console.log("reviewer yes is ok");
  })

  await db.collection('user').get().then(userdoc => {
    userdoc.forEach(doc => {
      if (doc.data().userid == userid) {
        userdocid = doc.id;
      }
    })
    db.collection('user').doc(userdocid).set({
      isreviewer: usercon
    }, { merge: true }).then(success => {
      console.log("reviwer user table");
    })
  })
}

async function DeclineArray(senderID, docid, userid) {
  var no = 'no';
  var usercon = 'false';
  var userdocid = '';
  await db.collection('testingreviewer').doc(docid).set({
    isreviewer: no
  }, { merge: true }).then(aa => {
    console.log("reviewer yes is ok");
  })

  await db.collection('user').get().then(userdoc => {
    userdoc.forEach(doc => {
      if (doc.data().userid == userid) {
        userdocid = doc.id;
      }
    })
    db.collection('user').doc(userdocid).set({
      isreviewer: usercon
    }, { merge: true }).then(success => {
      console.log("reviwer user table");
    })
  })
}



async function UploadVideoByReviewer(senderID,bookname,userMessage)
{  

      var datacheck=[];  
      await  db.collection('book').doc(bookname).collection('review').get().then(dbreviwer=>{
             dbreviwer.forEach(doc=>{
                datacheck.push(doc.data().reviwerid)
             })

             if(datacheck.includes(senderID))
             {
                  textMessage(senderID,"Sorry! You have already uploaded review for this book").then(so=>{
                    QuickReplyReviewerMenu(senderID)
                  })
             }
             else 
             {
                  db.collection('book').doc(bookname).collection('review').add({
                   reviwerid:senderID,
                   videolink:userMessage
                   }).then(oo=>{
                    textMessage(senderID,"Upload Video Successful").then(su=>{
                    QuickReplyReviewerMenu(senderID)
                    })
                   })
             }
        })

   
}

async function RetrieveVideo(senderID, dataarray) {
  await db.collection('book').doc(dataarray).collection('review').get().then(async (vid) => {
    const promises = [];
    vid.forEach(async (doc) => {
      promises.push(requestify
        .post('https://graph.facebook.com/v6.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN,
          {
            "recipient": {
              "id": senderID
            },
            "message": {
              "attachment": {
                "type": "template",
                "payload": {
                  "template_type": "media",
                  "elements": [
                    {
                      "media_type": "video",
                      "url": doc.data().videolink
                    }
                  ]
                }
              }
            }
          }).catch((err) => {
            console.log('Error getting documents', err);
          }));
    });
    await Promise.all(promises);
  })
}
// function whitelistDomains(res) {
//   var messageData = {
//           "whitelisted_domains": [
//             'https://bookchatbot.herokuapp.com'         
//           ]               
//   };
//   request({
//       url: 'https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
//       method: 'POST',
//       headers: {'Content-Type': 'application/json'},
//       form: messageData
//   },
//   function (error, response, body) {
//       if (!error && response.statusCode == 200) {          
//           res.send(body);
//       } else {           
//           res.send(body);
//       }
//   });
// } 
// function removePersistentMenu(res){
// 	var messageData = {
// 		"fields":[
// 			"persistent_menu",
// 			"get_started"
// 		]
// 	};

// 	request({
// 		url:'https:graph.facebook.com/v.2.6/me/messenger_profile?access_token='+PAGE_ACCESS_TOKEN,
// 		method: 'DELETE',
// 		headers: {'Content-Type': 'application/json'},
// 		form: messageData
// 	},
// 		function(error,response,body){
// 			if(!error && response.statusCode == 200){
// 				res.send(body);
// 			} else {
// 				res.send(body);
// 			}
		
// 	});
// }

