/*// lecture Strings

let firstName = 'harikrishna';
let lastName = 'bejjanki';

const yearOfBirth = 1990;

function calcAge(year){
return 2019 - yearOfBirth;
}

// ES5
console.log('This is ' + firstName + ' ' + lastName + ' ' + '. I was born in ' + yearOfBirth + '. Now I am ' + calcAge(yearOfBirth)+' years old' );

//ES6  template strings

console.log(`This is ${firstName} ${lastName}. I was born in ${yearOfBirth}. Now I am ${calcAge(yearOfBirth)} years old.`);
*/



// arrow functions and this keyword

// ES5 function

/* var box = {
    color: 'green',
    position: 1,
    clickMe: function () {
        var self = this;          // ---> this line get rid in ES6 arrow features

        document.querySelector('.green').addEventListener('click', function () {
            var str = 'This box position is ' + self.position + 'and also color is' + self.color
            alert(str);
            
        })
    }
}

box.clickMe(); */

//----------------------------------------------------------------


// ES6 function   // below arrow function shares the lexical this keyword to it sourrounding i.e, click me method. 


// var box = {
//     color: 'green',
//     position: 1,
//     clickMe: function () {
//         document.querySelector('.green').addEventListener('click',  ()=> {
//             var str = 'This box position is ' + this.position + 'and also color is' + this.color
//             alert(str);

//         })
//     }
// }

// box.clickMe();



//-------------------------------------------------------------------------


//ES5 fucntion constructor with .bind method


function Person(name) {
    this.name = name;
}

Person.prototype.myFriend = function (friends) {
    var arr = friends.map(function (el) {
        return this.name + ' is friend with  ' + el;
    }.bind(this))

    console.log('log', arr);

}
var arr1 = ['ravi', 'sampath', 'sai charan'];

var obj = new Person('harikrishna').myFriend(arr1);


// ES6 features

function Person(name) {
    this.name = name;
}

Person.prototype.myFriend = function (friends) {
    var arr = friends.map((el)=> {
        return this.name + ' is friend with  ' + el;
    })

    console.log('log', arr);

}
var arr2 = ['Mahesh', 'Suresh', 'Anil'];

var obj2 = new Person('harikrishna').myFriend(arr2);