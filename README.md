# Fragrant Module

+ [Github HomePage](https://github.com/TheTimelessX/fragrant)

## Installation
```bash
npm i fragrant
```

## Constructor Options

+ workingOn: string[] -> parsing this list, it allows you to use other string lists, default is process.argv .

+ usage: string -> the main and basic usage of your project, it depends on sensitivity mode .

+ sensitivity: high | low -> if you set sensitivity on high, it will log the usage banner when no argument inputted, but low wont log anything .

## Listening Modes
+ call: it will emit "find" event when your argument called, value is going to be `true`;

+ middle: it will emit "find" event when your argument called and carry an object (string or undefiend) . for example: --path /usr/bin

+ store: it will emit "find" event when your argument called and carry an object (string or undefiend) . for example: --path=/usr/bin

## Usage
```javascript

const { Fragrant } = require("fragrant");

let fragrant = new Fragrant({ sensitivity: "high", usage: "USAGE: -h / --help\n\n..." });

// add a fragrant
fragrant.add("call", "-h", "--help");

// or seeing details
let theHelpFlags = fragrant.add("call", "-h", "--help");
console.log(theHelpFlags);

/*
output:
 [
  {
    flag: '-h',
    type: 'call',
    id: '88843ebd-461c-48f1-a35e-0a46336bb3d1'
  },
  {
    flag: '--help',
    type: 'call',
    id: '49a4d6eb-11a2-4e45-9389-7e05a958f2a8'
  }
 ]
 */

// seeing what you added
let storage = fragrant.catchStorage();
console.log(storage);

// remove a flag by its flag id
let theHelpFlag = fragrant.add("call", "--help");
fragrant.remove(theHelpFlag[0].id);

// or 

let theFlags = fragrant.add("call", "-r", "--read");
let theFlagIds = theFlags.map(flag => flag.id);
fragrant.remove(theFlagIds);

// the events: find
fragrant.on("find", (args) => {
    console.log(args);
    /*
    output should be:

    {
        type: 'call',
        value: true,
        id: '7c7e93a3-bed8-477c-b16c-9613d11626da'
    }

    {
        type: 'middle',
        value: 'hi',
        id: '7c7e93a3-bed8-477c-b16c-9613d11626da'
    }
    
    {
        type: 'middle',
        value: undefiend,
        id: '7c7e93a3-bed8-477c-b16c-9613d11626da'
    }

    {
        type: 'store',
        value: 'hello world',
        id: '7c7e93a3-bed8-477c-b16c-9613d11626da'
    }
    
    {
        type: 'store',
        value: undefiend,
        id: '7c7e93a3-bed8-477c-b16c-9613d11626da'
    }
    */
})

// parse the args handler
// notice: always call it when you added your flags and listeners
fragrant.parse();

// delete everything
fragrant.clear();
```

## Something Interesting !
+ as i said you can edit the string list, the working list

+ for example:

```javascript

const sampleString = "--get 'hello world' --close"

const { Fragrant } = require("fragrant");

let fragrant = new Fragrant({ workingOn: sampleString.split(" "), sensitivity: "high", usage: "USAGE: -h / --help\n\n..." });
```
