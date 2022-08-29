# tae-tool
It stands for "Tarik Art Engine" (I used my real name, yes). It's a basic  art generator for those guys who are obsessed with generating bunch of random art, aka NFTs based on assets (images) you provide.
None-programmers will struggle a bit trying to run this program, just follow the instructions, and you should be good to go.
1. **Installation**<br/>
You have to download [NodeJS](https://nodejs.org/en/) to you machine to run this software
Clone the repository using git, or download if you are a psycho. Then, go to the downloaded folder and type the 3rd cmd which will install all the necessary dependecies.
```
git clone https://github.com/Txreq/tae-tool
cd ./tae-tool
npm install
```
2. **Setup you assets**<br/>
	- ***postioning***<br/>
First of all, you got to know the program won't position the assets for you magically, thus you have to do it your self.
	<a href="https://imgbb.com/"><img src="https://i.ibb.co/M5VgZH5/download.png" alt="download" border="0"></a>

	- ***naming***<br/>
	To make the software regonize the image value and trait please name it that way:
	 > *NOTE*:  Just keep the rarity right before the image extention
	```
	[value]_[rarity].png
	- e.g: myValue_myRarity.png
	```
	- ***add you custom rarities***
	Of course you can add your own rarities and to do that head up to `./configs/main.json` there you could find add rarities I have already added, delete them if you want and add yours
	```
	"rarities": [
		{ "key": "myRariy", "rate": { "up": 100, "down": 0 } }
	]
	```
	If you skiped all your math classes you will screw with the `rate`, take a look to this diagram to get an idea what the heck is the `up` & `down` values.

	<a href="https://ibb.co/fqd2wvw"><img src="https://i.ibb.co/mb5GW8W/Untitled-2022-08-27-1632.png" alt="Untitled-2022-08-27-1632" border="0"></a><br />
 
- To get a better understanding how in world this piece of software runs, take a look on the `assets` folder and `configs/main.json`, or contact me <br/>

3. **Ready!**
<br/>
If everything has been set, you can run it with this command
```
node .
# or
node index.js
```
<br/>

# Disclaimer ⚠️
DONT EVER TRY TO GENERATE A HIGH AMOUNT OF ART WITH IS PROGRAM IN YOUR MACHINE.
<br/>
I highly suggest for those pyschos who generates up to 1k, 10k, 100k images to do all what I have been said in a hosted virtual machine which has a good CPU and RAM.
