(function(){ 

//Selector
  const formElm = document.querySelector('form')
  const numberInputElm = document.querySelector('.tweet-number')
  const textInputElm = document.querySelector('.tweet-text')
  const serialGroupElm = document.querySelector('.tweet-serial')
  const filterElm = document.querySelector('#filter')
  const addTweetElm = document.querySelector('.add-tweet')
  //tracking tweets
  let tweets=[];

  //function for time posting with tweet
  function getDate()
{
	let  today = new Date();
	let  HH = String(today.getHours()).padStart(2, '0');
	let  MM = String(today.getMinutes() + 1).padStart(2, '0'); //janvier = 0
	let  SS	= today.getSeconds();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  return time=dd + '/' + mm + '/' + yyyy+ ' '+ HH + ':' + MM + ':' + SS
}
 let time=setInterval(getDate,1000); 

//function for text area not more than 250 char
 $(document).ready(function() {
  var len = 0;
  var maxchar = 200;

  $( '#my-input' ).keyup(function(){
    len = this.value.length
    if(len > maxchar){
        return false;
    }
    else if (len > 0) {
        $( "#remainingC" ).html( "Remaining characters: " +( maxchar - len ) );
    }
    else {
        $( "#remainingC" ).html( "Remaining characters: " +( maxchar ) );
    }
  })
});
  
  function showAllTweetsToUI(filteredTweet) {
    serialGroupElm.innerHTML = ''
    filteredTweet.forEach((tweet) => {
      const serialElm = `<li class="tweet-serial-number number-${tweet.id} collection-number">
      <strong>${tweet.number}</strong>- <span class="text">${tweet.text}</span>
      <span class="datetime">${tweet.time}</span>
      <i class="fa fa-trash delete-tweet float-right"></i>
      <i class="fa fa-pencil-alt edit-tweet float-right"></i>
    </li>`
  
  serialGroupElm.insertAdjacentHTML('afterbegin', serialElm)
    })
  }
  
function updateAfterRemove(tweets,id) {
      return tweets.filter((tweet) => tweet.id !== id)
    }
  
function removeTweetFromDataStore(id) {
      const tweetsAfterDelete = updateAfterRemove(tweets, id)
      tweets = tweetsAfterDelete
    }
  
function removeTweetFromUI(id) {
      document.querySelector(`.number-${id}`).remove()
    }
  
function getTweetID(elm) {
      const twElm = elm.parentElement
      return Number(twElm.classList[1].split('-')[1])
    }  
function resetInput() {
    numberInputElm.value= ''
    textInputElm.value = ''
  }
  
function addTweetToUI(id,number, text) {
    //generate id
    const serialElm = `<li class="tweet-serial-number number-${id} collection-number">
            <strong>${number}</strong>- <span class="text">${text}</span>
            <span class="datetime">${time}</span>
            <i class="fa fa-pencil-alt edit-tweet float-right"></i>
            <i class="fa fa-trash delete-tweet float-right"></i>
          </li>`
  
    serialGroupElm.insertAdjacentHTML('afterbegin', serialElm)
  }
  
function validateInput(number, text) {
    let isError = false
    if (!number || number.length <= 0) {
      isError = true
    }
    if (!text || text.length >=250) {
      isError = true
    }
    return isError
  }
  
function receiveInputs() {
    const number = numberInputElm.value
    const text = textInputElm.value
    return ({
      number,
      text,
      time
    })
  }
  
function addTweetToStorage(tweet){
    let tweets
      if (localStorage.getItem('storeTweets')) {
        tweets = JSON.parse(localStorage.getItem('storeTweets'))
        tweets.push(tweet)
        //update to localStorage
        localStorage.setItem('storeTweets', JSON.stringify(tweets))
      } else {
        tweets = []
        tweets.push(tweet)
        //update to localStorage
        localStorage.setItem('storeTweets', JSON.stringify(tweets))
      }
  }

function removeTweetFromStorage(id){
    //pick from localStorage
    const tweets = JSON.parse(localStorage.getItem('storeTweets'))
    //filter
    const tweetsAfterRemove = updateAfterRemove(tweets, id)
    //save data to localStorage
    localStorage.setItem('storeTweets', JSON.stringify(tweetsAfterRemove))
  }

  function populateUIInEditState(tweet) {
    numberInputElm.value = tweet.number
    textInputElm.value = tweet.text
    time
  }

  function showUpdateBtn() {
    const elm = `<button type="button" class="btn mt-3 btn-block btn-secondary update-tweet">Update</button>`
    //hide the submit button
    addTweetElm.style.display = 'none'
    formElm.insertAdjacentHTML('beforeend', elm)
  }

  function updateTweetsToStorage(updatedTweet) {
    if (localStorage.getItem('storeTweets')) {
      localStorage.setItem('storeTweets', JSON.stringify(tweets))
    }
    if (localStorage.getItem('storeTweets')) {
      const tweets = JSON.parse(localStorage.getItem('storeTweets'))
      const updatedTweets = tweets.map((tweet) => {
        if (tweet.id === updatedTweet.id) {
          //Tweet should be updated
          return {
            id: updatedTweet.id,
            number: updatedTweet.number,
            text: updatedTweet.text,
            time:updatedTweet.time,
          }
        } else {
          //no update
          return tweet
        }
      })
      localStorage.setItem('storeTweets', JSON.stringify(updatedTweets))
    }
  }

  function init(){
    let updatedTweetId;
    formElm.addEventListener('submit', (evt) => {
    
      //prevent default action(browser reloading)
       evt.preventDefault()
      //receiving input
      const { number, text } = receiveInputs();
       //validate input
      const isError = validateInput(number, text)
      if (isError) {
        alert('please provide valid input')
         return
      }
      //generate item
      const id = tweets.length
    
      const tweet = {
        id: id,
        number: number,
        text: text,
        time:time
      }
      //add item to data store
      tweets.push(tweet)
      // add item to the UI
       addTweetToUI(id,number,text,time)  
      //add Tweet to localStorage
      addTweetToStorage(tweet)
      //reset the input
      resetInput()  
    })
  
  //filtering tweets
  filterElm.addEventListener('keyup', (evt) => {
    //filter depend on this value
    const filterValue = evt.target.value
    const filteredTweet = tweets.filter((tweet) =>
       tweet.number.includes(filterValue)
    )
    console.log(filteredTweet);
    // show Tweet to UI
    showAllTweetsToUI(filteredTweet)
  })
  
  
  //deleting item (event delegation)
  serialGroupElm.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('delete-tweet')) {
    const id = getTweetID(evt.target)
   //   remove tweet from UI
        removeTweetFromUI(id);
   //   remove tweet from  data store
       removeTweetFromDataStore(id);
   //   delete item from storage
      removeTweetFromStorage(id)
    } 
   else if (evt.target.classList.contains('edit-tweet')) {
     //pick the item id
    updatedTweetId = getTweetID(evt.target)
     //find the item
     const foundTweet = tweets.find((tweet) => tweet.id === updatedTweetId)
     //populate the item data to UI
     populateUIInEditState(foundTweet)
      //show updated button
      if (!document.querySelector('.update-tweet')) {
        showUpdateBtn()
      }
    }

   })

   formElm.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('update-tweet')) {
      //pick the data from the field
      const { number, text} = receiveInputs()
      //validate the input
      const isError = validateInput(number, text)

      if (isError) {
        alert('please provide valid input')
        return
      }
      //updated data should be updated to data store
     tweets = tweets.map((tweet) => {
        if (tweet.id === updatedTweetId) {
          //item should be updated
          return {
            id: tweet.id,
            number,
            text,
            time
          }
        } else {
          //no update
          return tweet
        }
        
      })
      //reset Input
      resetInput()

      //show Submit button
      addTweetElm.style.display = 'block'
      //hide update button

      //updated data should be updated to UI
      showAllTweetsToUI(tweets)
       document.querySelector('.update-tweet').remove()
      //updated data should be updated to localStorage
      const tweet= {
        id: updatedTweetId,
        number,
        text,
        time
      }

      updateTweetsToStorage(tweet)
    }
  })
  
   document.addEventListener('DOMContentLoaded', (e) => {
    //checking item into localStorage
    if (localStorage.getItem('storeTweets')) {
     tweets = JSON.parse(localStorage.getItem('storeTweets'))
      //show items to UI
      showAllTweetsToUI(tweets)
    }
  })
  }
  init();
})()

