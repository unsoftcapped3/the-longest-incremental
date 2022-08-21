const messages = [
  // these tickers require something to be unlocked
  // stop adding useless arguments to finctions
  [
    "Why are you not generating points at all?",
    _ => Decimal.eq(player.points, Decimal.dTen),
  ],
  [
    "You have more points than the number of atoms in the observable universe",
    _ => Decimal.gte(player.points, 1e80),
  ],
  [
    "What's the point of large numbers if there are larger ones?",
    _ => Decimal.gte(player.points, 1e100),
  ],
  [
    "Where is my Big Crunch?",
    _ => Decimal.gte(player.points, Number.MAX_VALUE),
  ],
  ["The Booster economy, Jack!", _ => player.boost.unl],
  [
    "Tip: Try to maximize Enhancements onto Generators until Upgrade 6",
    _ => player.boost.unl,
  ],
  ["and in that light, i find boosters", _ => player.boost.unl],
  ["Booster Eden", _ => player.boost.unl],
  ["It will grow soon.", _ => !L1_CONSUME.unl()],
  ["CONSUME THE BOOSTERS", _ => L1_CONSUME.unl()],
  ["Tip: Only consume once.", _ => L1_CONSUME.unl()],
  [
    "Creator reports that boosters aren't a effective way.",
    (_) => L1_CONSUME.unl(),
  ],
  ["Dark Energy? Why not Light Energy?", _ => L1_CONSUME.unl()],
  ["It has begun to grow.", _ => L1_CONSUME.unl() && !player.dark.unl],
  ["You have 8 minutes left to live.", _ => player.dark && player.dark.unl],
  ["You are one with the Dark.", _ => player.dark && player.dark.unl],
  ["Hey, who turned off the lights?", _ => player.dark && player.dark.unl],
  ["At least you saw eternal nightfall.", _ => player.dark && player.dark.unl],
  ["Darkening? Huh?", _ => player.dark && player.dark.unl],
  ["It refuses to stop growing.", _ => player.dark && player.dark.unl],
  [
    "Abilities aren't passive. At least you get activity.",
    (_) => hasUpg(2, "dark"),
  ],
  ["Now, we are recalling for more darkness!", _ => hasUpg(2, "dark")],
  ["Hey! Where did the Dark go?!", _ => hasUpg(2, "dark")],
  [
    "Harvesting dark matter, recalling for supplies...",
    _ => hasUpg(2, "dark"),
  ],
  ["Do you realize it's a source for the Dark?", _ => hasUpg(2, "dark")],
  ["The Dark's necessary supply was overloaded...", _ => hasUpg(2, "dark")],
  [
    "Hey! You can fuse things into things now! Yippee!",
    _ => hasUpg(7, "dark"),
  ],
  ["Fusing is life.", _ => hasUpg(7, "dark")],
  ["Challenges initiated.", _ => hasUpg(11, "dark")],
  [
    "Hey! I couldn't get my best score inside challenges.",
    _ => hasUpg(11, "dark"),
  ],
  [
    "Challenge ourselves, and you're also going to be challenged.",
    _ => hasUpg(11, "dark"),
  ],
  ["Now how could we pass the boulders?", _ => hasUpg(11, "dark")],
  [
    "The long era of darkness is finally coming to an end. The sun's gonna FINALLY shine again, took us too long...",
    _ => hasUpg(11, "dark"),
  ],
  [
    "The best challenge is all of them. That's what Zenith's for.",
    _ => hasUpg(11, "dark"),
  ],
  ["It seems to slow down...", ()=>hasUpg(11, "dark")],
  ["Back in my day, Infinity was 255.", _ => hasAch(34)],
  [
    `Breaking News: A person has reached 1.80e308 point but a suddenly the person saw a light coming from and reveals a new layer called ???. You can check them <a href="javascript:(function(){rickroll()})()" >here!</a>`,
    _ => hasAch(34),
  ],
  ["It hungers.", () => player.dark && player.dark.chal && player.dark.chal[6] && player.dark.chal[6]>0],
  ["The Avatar is the master of four elements. How many will you master by the end?", _ => layer_placeholder(3)],
  ["It hungers.", _ => layer_placeholder(3)],
  ["It seems to slow down...", _ => layer_placeholder(3)],
  ["Into the Infinite", _ => false], //unlocked after Extend is unlocked
  [
    "I see you didn’t even stop at all. Go leave and GET A LIFE!",
    _ => gameEnded(),
  ],
  [
    "I guess you won... The dark failed to stop you. The next update will be: Elemental! (8 elements, a lot of features and counting...)",
    _ => gameEnded(),
  ],
  [
    "If you see this in the game, you just simultaneously won and got lucky.",
    _ => gameEnded() && Math.random() < 0.1,
  ],
  // these tickers require specific settings
  [
    "You know your life rests in how much you do, right?",
    _ => player.theme === "wannacry",
  ],
  /* ["You will never see this yet again", ()=> inEndgameScreen()],*/
  [
    "have you ever tried changing the theme? it's in settings.",
    _ => player.theme === "default",
  ],
  [
    "have you ever tried unchanging the theme? it's in settings.",
    _ => player.theme !== "default",
  ],
  [
    "The swaggiest theme out there is the one you are using right now",
    _ => player.theme !== "compact",
  ],
  [
    "If you see this, go tell meta that she's a good artist",
    _ => player.icon === "meta",
  ],
  ["EEEH? EASY MODE?", _ => player.modes && player.modes.diff == 0],

  // these tickers are always shown
  ["Longest Incremental Game ma balls"],
  ["Inslated"],
  ["that has already been added"],
  [
    "Rickrolls are fun. Did you know that you have a small chance to get rickrolled?",
  ],
  ["dry boomer aarex"],
  ["aarex is lightning?! :scream:"],
  ["we hope this is the longest incremental"],
  ["thats what i was gonna do :skull:"],
  ["wtf is a news_ticker_base"],
  ['"we should probably fix the game first" -randomtuba'],
  [
    "Casual gamers decided to quit this incremental game due to an infinite amount of content.",
  ],
  [
    "You have almost infinitely many layers left if you want to reach the summit.",
  ],
  [
    "why are we making this with no payment, no monetary value, no reward?? -someone who delves on life",
  ],
  [`"Here's a tip: Life is ambiguous." - some nerd`],
  ["Creator admits that there is a bug. Gamers are outraged."],
  ["There are 1.79e308 bugs, multiplying development speed by 0."],
  [
    "when the developers don't know what to develop, they just add more news tickers.",
  ],
  ["why can't i fucking CONTRIBUTE - CRG"],
  ["gwa"],
  [":ungwa:"],
  [" ".repeat(200) + "you thought this news ticker was empty?"],
  ["Have you played Ordinal Markup yet?"],
  ["j"],
  ["the j is real"],
  [`we do a lot of trolling <img src="${imageMap("troll")}" />`],
  [
    `What is the point of a news ticker? Is it to distract you? To make jokes? Or is it something else? Or is it <img src="${imageMap(
      "troll"
    )}" />-ing?`,
  ],
  ["the 9th dimension does not exist"],
  ["the 9th dimension does exist"],
  ["yes, we do dilate time."],
  ["this is most useless news ticker"],
  ["this is most useful news ticker"],
  ["paradoxes 69: this is not a paradox"],
  ["paradoxes 420: this is a paradox"],
  ["paradoxes 69420: gwa isn't real"],
  ['"why is it broken?" -developers'],
  [
    "well, since you're reading this I'm sorry to say this is pointless to read so just move along and ignore this. Wait, you're still here? I said move along, there's nothing here. Ok, go to hell now!!",
  ],
  ['"these are all unfunny" -randomtuba'],
  [
    "BREAKING NEWS: Local developer has been found guilty of resetting saves, community shocked and outraged",
  ],
  ["what happens next will shock you"],
  ["Fact: Do you know that Longest Incremental has too many layers?"],
  ["this game is just a layer simulator"],
  ["this is 50th news ticker to be added"],
  [
    "Did you know that there are not 1 devs, not 2, not 3, not... (to be continued)",
  ],
  ["...hey why don't I let you guess it?"],
  ["this game's code is written in... nothing."],
  ["this game's code is written in... js."],
  ["this game's code is written in... scratch."],
  ["this game's code is written in... json."],
  ["this game's code is written in... css."],
  ["this game's code is written in... html."],
  ["this game's code is written in... txt."],
  ["this game's code is written in... classes."],
  ["this game's code is written in... brainfuck."],
  ["this game's code is written in... pineapples."],
  [
    "<a href='javascript:(function(){rickroll()})()'>click here for free gwa!</a>",
  ],
  [
    "<a href='javascript:(function(){rickroll()})()'>do you know what ehehe in di is?</a>",
  ],
  ["too short 1/0"],
  [
    "how much boost could a boosted booster boost if a booster could boost boosts",
  ],
  ["How many ticks can a tick tick at?"],
  ['"DEEFAT" -crg'],
  ["Next update in 4.8 hours"],
  ["Ow, that hurt! Stop clicking me!"],
  ["ae".repeat(100)],
  ["imagine a newsticker that says 'j'"],
  [`imagine a newsticker that says "imagine a newsticker that says 'j'"`],
  ["you are very cool!"],
  ["Going horizontally is fun! Weeeeeeeeeeeeee!"],
  ["do it that way we can put memes in general"],
  [
    "There are a total of 2 layers in the longest incremental game. Does that mean it's shorter than 3 layers tree?",
  ],
  [
    "We will get cancelled for this, but a layer is a layer. Size & age doesn't matter. A new layer is as important as the oldest layer.",
  ],
  ["softcaps are terrible for balancing"],
  ["incremental is just advanced waiting"],
  [
    "imagine a game with over 1 thousand different news ticker messages but only three layers of prestiging",
  ],
  ["adding news tickers might have been a bad idea"],
  [
    "this game is written on glitch.com (at least as of writing this news ticker)",
  ],
  ["grind, buy upgrades, prestige, ".repeat(5)],
  ['Petition to call F notation "Science Fiction Notation"'],
  ["there are SOFT layers"],
  ["(softcapped)"],
  ["(hardcapped)"],
  ["(scaled)"],
  ["(obscured)"],
  ["(soft)"],
  ["(capped)"],
  ["Longest Incremental Game? More like shortest incremental game"],
  [
    "You've just been news tickered, send a screenshot of this news ticker to get un-news tickered",
  ],
  ["will there be a person who really waits 5 hours to see the game loading?"],
  ["did you know softcaps are bad for your health?"],
  ["When you get e^100 points, all your bugs will be gone."],
  ["Cthulhu is here"],
  [
    "Hello. This is You from the future. The 5 hour update is finally here.                              Sorry, the last message was an accident, the update is always in 5 hours, it has never nor will it ever come out.",
  ],
  ["Capybaras are the cutest animal."],
  ["If a cow isn't a dog, then is a lion just a small elephant?"],
  ["BLOOD FOR THE BLOOD GOD"],
  [
    "Imagine a world without bugs, we'd be the closest we ever got to world peace",
  ],
  [":flushed:"],
  [
    'meta has a great singing voice, you should listen to it                                                                  "actually no don\'t" -a liar',
  ],
  ["[this news ticker is left intentionally blank]"],
  ['when you forget to put the " at the end of a string'],
  [
    "If you're paid hourly, don't forget to not put a \" at the end of a string",
  ],
  ["Oh no we're out of content ideas."],
  [
    "You think your news ticker can be longer than the bee movie script? Good luck!",
  ], //bold of you to assume someone on the dev team won't try -Meta
  ["A".repeat(50) + " SOMEONE HELP"],
  ["Developers make too many news tickers and implement a bit of content..."],
  ["Boy what the hell boy :raised_eyebrow:"],
  ["Inslation"],
  ["bugs never lie - some bug"],
  ["Welcome to the longest incremental game, hope you enjoy!"],
  [
    "‘When I grow up, I want to destroy (softcapped) and (hardcapped)!’ -young boy that’s 5 years old and plays this game",
  ],
  ["I see you didn’t even stop at all. Go leave and GET A LIFE!"],
  [
    '"Consume Boosters. sacrificed remaining" - the game. In other news, you just lost The Game',
  ],
  ["Boosters, Darken, Elemental, Ascend? Freedom awaits for me!"],
  [
    "A is Ascend, B is Boosters, C is... [missing], D is Darken, and E is Elemental.",
  ],
  ["Fact: We can generate random layer names when we ran out of ideas."],
  ["This game is planned to beat AD: NG-5+3 in length."],
  ["The altar awaits your recall..."],
  [
    "Somebody just Boosted our production, became one with the Dark, got Elements from his imagination, Extended our game, and Ascended to Heaven...",
  ],
  [
    "A forbidden ghost scientist went into Elemental Tree to find spectral matter.",
  ],
  ["Lightnize: Become the thunderous Lightning."],
  ["Sextillions are better without the tillions!"],
  ["Banana monke make dart go brrr, balloon scared"],
  ["'I'm the son of Zeus!' ~ A person who doesn't know Greek gods"],
  [
    "Guns! Guns! Guns! Gu- This news ticker has been removed for being too offensive.",
  ],
  [
    "Hey, what's the opposite of defensive? Of-[This user has been banned from the news tricker community]",
  ],
  ["DEEFAT nuts"],
  [
    '"You have reached Infinity, and I shall endor- wait wrong game" - Infinity',
  ],
  ["/g/ approves!"],
  ["IROwO"],
  ["Having a cow is nice!"],
  ['"OH NO DOWNVOID WHAT ARE YOU DOING" -meta'],
  ["Almost everybody that breathes air dies! Stop breathing now."],
  [
    "You don't need a parachute to go skydiving, you only need a parachute to do it multiple times",
  ],
  [
    "DHMO (Dihydrogen Monoxide) is the most dangerous substance known, for more info visit <a href='www.dhmo.org'>www.dhmo.org</a>",
  ],
  [
    "We have to talk about the elephant in the room. His name is Greg, and he is 4 years old.",
  ],
  ["This News Ticker has to be left blank for legal reasons... oh shit"],
  ["Why are you reading this" + "?".repeat(10)],
  ["Most dead people aren't alive!"],
  ["You might have won, but you... won? I forgor the phrase"],
  ["'No. No more tickers. I won't allow it. You have sinned.''-boringloser49"],
  ["What's a game without tickers just ticking"],
  [
    "I had an idea, but was called crazy. What if we had an actual clock ticker, just ticking? :D",
  ],
  [
    "Apparently some tickers are just emojis, but it seems to be a myth! Nobody came across one yet",
  ],
  ["New Ticks Ticks Newly Ticking Tickers"],
  ["Tickies!"],
  [
    "Why did America lose in a fight with North Korea?                                       ...wait, did they?",
  ],
  [
    "The update is always 4 hours, 30 minutes, 1,200 seconds and 600,000 milliseconds away!",
  ],
  ["YOU KNOW WHAT I HATE???! Timewalls!!!"],
  [
    "ᯡࠣ䈌ঀ㬡㠹戡㡠⌠ీڤĸ֐਀ჯVŬ䭊୴嬆䔱ಠথ嬣ᣙ戠ି⸢〡映乄m呱检抌害夺⹾摋˴䀥〸΀ᠮ智ᾢȢᱥအ䘰〡䳁␥壃㥎₩◣䅡㵈⡆n①ຠǡ䚪❅⎣K摣ৎ੺䜢⊰㪋㦐⑾⋶㼡ؼ䊧ʰᄧ瀩༔䫵͟Ͳ嶂熠‱䌼攵㙪త侬⥈嘶妘䠠Ḡֈ㰭ᴫං⊐x倡娢沓㘪䭽䶢⻫䞂⏑ᠯⵔॺ᭐愚㾇Ἵ冏沈7⮧塨䑃䈲ධ獄⁁ᡐᣗ෠ࡐ呦C⅂沨Ôⱸ㢬⺄ᣰ䍁仧ᏸ㢩ḗ᥈㉨ඃ䆖䨴ሧ䤜əąᐨ㠤Ñռ㹤䅂农... yes, this is how saves looked like when this game was released.",
  ],
  [
    "I wonder if someone will refresh the page a lot of times just to see some a new title for the game.",
  ],
  ["Who doesn't like a long incremental game?"],
  ["how to make the longest incremental: just add a millenium long timewall"],
  [
    '"The Billion-Year Incremental when" -Meta (20% discount for immortal people!)',
  ],
  [
    "'So I can play this game till I die, and I still can’t complete it? Oh, that’s a funny joke.' -literally everyone",
  ],
  ["This game is more than five hours"],
  [
    `"new rule: no news tickers longer than 500 characters" Okay, uhhhhhh... so I need to make this shorter than 500 characters? That's going to be an annoying job, but fine, I guess. Anyway, how's your day? It's probably better than mine. This is honestly a pretty long game, but it's nowhere NEAR the top. After all, Synergism exists, a game which has 5 layers and lasts for months. If we expand the suffering enough, we might be able to beat that. Oh, oops, I'm approaching the 500 character limit, aaaaaaaand there we go. Have a nice day! [minute wait] Jeez, that was a LONG news ticker.`,
  ],
  ["while (true) {bugs=bugs+1}"],
  [":unungwa:      wait, isn't that just :gwa:?"],
  [`"I've just realized that I'm probably the worst developer here" -downvoid`],
  [
    `'"I've just realized that I'm probably the worst developer here" -downvoid' don't worry downvoid i somehow manage to be even worse -Meta`,
  ],
  ["NEW UPDATE: v4.7 (gwa layer update)"],
  ["At last, we are longer than the reality update in antimatter dimensions!"],
  [
    "Don’t upvote this, how is he supposed to implement <i>this</i> into the game?!?!",
  ],
  [
    "??????? 9,122: ??????s the game with 12 - 54 new features for every prior layer and unlocks Layer 9,125.",
  ],
  ["Balancing patch: Nerfed multiplier boosts."],
  ["Layer, extend, profit."],
  ["Fly away, zappies! ~ Aarex"],
  [
    "If you think there is are a lot of spoilers in news, you are wrong. They are plans which were just leaked accidentally. But after we added them, they became spoilers, and we forgot to add req on it.",
  ],
  [
    "Did you know that the news ticker contains spoilers for future updates? Better memorize them now before people remove this!",
  ],
  ["Good job even trying, you cannot complete this."],
  [
    "The game would probably load a few milliseconds faster if these weren't present.",
  ],
  ["no we are suggesting news tickers"],
  [
    '"no we are suggesting news tickers" - people when they don\'t want to get caught chatting in here"',
  ],
  [`"Uncaught BugError: bug occured"`],
  [
    "Imagine someone pinging in the code editor (it really happened before but whatever)",
  ],
  ["// @yyyy7089#7238 fix this bug"],
  [">bruh"],
  ["No cap"],
  ['"add this one" - ngX'],
  ["Let's softcap the newsticker, cause why not?"],
  ["The only thing that does not get softcapped is newsticker amount."],
  ["Suggest news tickers <a href='https://discord.gg/GBHavRPeke'>here!</a>"],
  ["Our planning document is longer than the game itself!"],
  ["when will be notations added? - yyyy"],
  ["buy, wait, rebirth, buy, wait, rebirth."],
  ["if glitch is down, we will make more news."],
  // these tickers are from #news-ticker-suggestion
  ["Wait 3^3-2 hours to have a new update! (Not 5 hours, trust me)"],
  ['"adhere to the spirit of the rules, not the letter" - no one, ever'],
  ["(trollcapped)"],
  ["1+1=1.1 (softcapped)"],
  ["haha you still can’t progress lol"],
  ["Go on. Progress now. You can’t? Good. - (softcapped) and (hardcapped)"],
  [
    "Did you know that the most spoken conlang is the Indonesian language? You probably never needed to know that in your LIFE, but now you know anyway,",
  ],
  [
    "the only game where to be a dev you only need to have a search engine and break_eternity.js",
  ],
  ["This game takes more than 5 hours, trust me"],
  ["Next update in NaN hours"],
  ["help"],
  [":аughhhhhhhhhhhhhhhhhhhhhhhhhhhhh:"],
  [
    "I swear, are we going to chat in this channel and submit all this as news tickers???????",
  ],
  ["top news bottom news"],
  ["Here's a hidden tip! Stop reading the news"],
  ["this game is sus"],
  ["I sure love Generak"],
  ["Capping as usual, I see!"],
  [
    "Development has been slowing down after the rapture of August 11th with half the dev team wiped out of existence, but we will recover shortly.",
  ],
  [
    "Why are you reading the news again? Go focus on the actual game. In other news...",
  ],
  ["the fog"],
  ["august 11th 2023 will be the worst day in the TLI discord server"],
  ["I WILL NOT BE MOVED"],
  ["Googologists loves playing incremental games"],
  ["The following message was brought to you by the voices in your head."],
  ["Imagine 10 people editing the same code. Wait, that's real."],
  ["gwacamole"],
  [
    "Imagine a collab incremental that somehow doesn't dissolve into craziness... wait, aren't you playing that right now?",
  ],
  [
    `Suggest your news ticker <a href="javascript:(function(){rickroll()})()" >here!</a>`,
  ],
  [`<a href="javascript:(function(){rickroll()})()" >Beta link</a>`],
  ["3^3 isn't 7 its 27"],
  ["Why are there so many mentions of gwas in the news?"],
  ["Never gonna give you up, never gonna let you down"],
  ["The Booster economy, Jack!"],
  [
    "booster boosts points, so do effective boosters effectively boost points??",
  ],
  ["chocolate cake"],
  ["if 3^3=7, then what is 7^7?"],
  ["7^7 is 43"],
  [
    "Have you been playing all summer? You think this is a game?! Well, guess what? You just lost.",
  ],
  ["We have ran out of news tickers. They are now called olds tickers."],
  ["oh heavens"],
  [`"gwa".repeat(100)`],
  ["Look mom, I’m on the news!"],
  ["Pssh, news ticker is so overrated. Get something new to like"],
  ["and in that light, i find boosters"],
  [
    "This just in: Ohio has overtaken the entire North American continent. Only the 12th Albania is able to stop it.",
  ],
  ['"at least the babylonians had a pattern they\'d STICK to" - Meta'],
  [
    "Legend has it that the entirety of Homestuck is hidden inside this news ticker. You will never know. Don't bother checking the source code, it's encrypted.",
  ],
  [
    "Hey, should we use American English or British English for the tickers? Actually, to annoy BOTH parties, why not Australian English?... wait, no, just use Polish or something.",
  ],
  [
    '"TLI 2 is under development and expected to release before Reality." -Dystopian news sources',
  ],
  [
    "We have a tradition to put a scrolling random text field on every game that we make",
  ],
  ["Don't mind me, just subtracting from my x position"],
  ["boosclusion"],
  ["People do crazy math of sorts just to give you a 0.00001% nerf!"],
  ["when your boosters is the same as your potential x 10"],
  ["omgggg my incomontal reachs up to E3.741e6#{#{##}(##+#+#)}2,095 thwefore is good!!!1!11!!1!1! why get no likesssssssss on twteer?????????!??!?"],
  //ok I'm tired of having to put brackets around everything so I'll add code to make it not need that,
  ["You like bread?"],
  ['We always put a so called "news ticker" on every single incremental game we make, even though it\'s just text that moves to the left and when it disappears we get new text that moves to the left as well.'],
  ["01000101"],
  ["someone go make a news ticker in a news ticker in a news ticker in a news ticker in a news ticker in a... [INFINITE LOOP]"],
  ['"I thought there wouldn\'t be any aarex timewalls in this game" -a new player'],
  ["Live news: there is a trend in making games more obscured to intentionally confuse players - some game nerd"],
  ['Why do we put _ in every single function regardless if we\'re in python or if it is even called with a argument???? Is this "aarex-style coding"? -some dev'],
  ["if you're a dev and you're reading this get back to work there are like a myriad bugs"],
  ["Hopefully the timewalls aren't at the level of leaving the game on for two weeks for a shampoo to charge"],
  ["@bug fixer (PR) we have bug"],
  ["The programmer has a nap. Hold out! Programmer!"],
  ['"BREAKING NEWS: ".repeat(30)'],
  ["Devs are really fond of spoiling the game in the news specifically"],
  ["In another multiverse, there is a game call the trollest incremental. It has no layer and maker make point ^^1e100 per second. But point gain is Softcapped for 1e10000000 times"],
  ["In yet another multiverse js is broken and people use python 🐍"],
  ["The Avatar is the master of four elements. How many will you master by the end?"],
  ["Eight, actually"],
  ["In another multiverse, there is a game call the newest incremental. It has nothing there except there are 1e100 news messages."],
  ["There exists a timeline where everyone playing this game actually has a life"],
  ["In yet another multiverse people keep pinging people to solve bugs because literally almost no one knows the code and the plans (also definitely not a spoiler hehe...)"],
  ["AMAIGYEA: Ask Me and I'll Give You Editing Access - Incremental Game Edition"],
  ["If you are still reading this you deserve to get punished. <i>then rickrolls you</i>"],
  ["Epic (form #one-letter-news-suggestion)"],
  ["We should keep that in the code! Yeah, that bug is now a feature!"],
  ["Once upon a time, there was an incremental so bad that we cannot disclose this information to you. The end."],
  ['""""Hi." - news ticker 1" - news ticker 2" - news ticker 3" ... (lol imagine)'],
  ['ERROR: 404 | The page "actuallygoodincrementalga.me/real/omggoodincrementalgame.html" cannot be found.'],
  ["i think i sent too much lol"],
  ["The high god of softcaps has been (softcapped) softcapped times. - some.... (softcapped)"],
  ["SCREW YOU. <Unsoftcaps your softcap>"],
  ["The Anti-Hardcap-Organization has come to destroy you."],
  ["omgggg my incomontal reachs up to E3.741e6#{#{##}(##+#+#)}2,095 thwefore is good!!!1!11!!1!1! why get no likesssssssss on twteer?????????!??!?"],
  ["If you need gwa on how to get through the gwa, check out the enclosed gwa"],
  ["The point now...?"],
  ['"mmmmmmmmmmmmmmmmmmmmmmmmm" - TheMKeyHolder'],
  ["[ended]"],
  ["Breaking News: ERROR: THE BOOSTERS DOES NOT EXIST"],
  ["I NEED MOAR INFLATION!! the game does not have enough numbers - some average gamer"],
  ["gwaranteed"],
  ["hippity hoppity this game is now my property"],
  ["Did you think existing would be normal?"],
  ["What's normal? Distance incremental mode normal? This game normal (which is technically hard by the way)? Real life normal? (this should be redacted) Anything normal?"],
  
  ////these tickers require luck
  ["It's Morbin Time!!", _ => Math.random() < 0.1],
  ["You have gotten very lucky.", _ => Math.random() < 0.01],
  [
    "There is a 0.1% chance of seeing this message. That's the same chance as the title of this game being 'Trollcremental 2'.",
    _ => Math.random() < 0.001,
  ],
  ["Go buy a lottery ticket.", _ => Math.random() < 0.0001],
  ["Hey you just won a lottery.", _ => Math.random() < 1e-6],
  [
    "Rickroll yourself to get rid of this news ticker. ".repeat(50),
    _ => Math.random() < 1e-7,
  ],
  ["Hey, you just won two lotteries in a row.", _ => Math.random() < 1e-11],
  [
    "Your luck skills broke the multiverse. Report this on the Discord if this happens.",
    _ => {
      const val = Math.random() < 1e-30;
      if (val) rickroll();
      return val;
    },
  ], // it happened in jacorb's server (wait, did it get "zero"?)
  [
    "Your luck skills broke the megaverse. PLEASE REPORT THIS ON THE DISCORD IF THIS HAPPENS.",
    _ => {
      const val = Math.random() < 1e-300;
      if (val) rickroll();
      return val;
    },
  ],
  [
    "Ummmmmmmmmmmmmmmmmmmmmmmmmmmmmmm............. you got veeeerry lucky. IF YOU SEE THIS YOU MUST REPORT THIS ON THE DISCORD<s>or else</s>",
    _ => {
      const val = Math.random() === 0;
      if (val) rickroll();
      return val;
    },
  ],
  // impossible news tickers
  ["You'll never see this!", _ => !player.news],
  ["Liar liar liar", _ => player.lastTick > Date.now()],
  ["The impossible happened.", _ => Math.random() < 0],
  ["We should keep that in the code! Yeah, that bug is now a feature!", _ => false],
  ["If you see this you deserve a hard reset", _ => false],
  [
    "If you see this yell at the dev(s) to make more news tickers",
    _ => messages.length < 300,
  ],
];
messages.push([
  `funny fact: there are ${
    messages.length + 1
  } news ticker messages, but only 2 of them gives you actual tips, the rest of them are either jokes or trolls`,
]);

let ticker;
let tickerContainer;
let newsPosition = -Infinity;
let lastNewsPos = Date.now();

function toggleNews() {
  player.news = !player.news;
}

function tickNews() {
  const diff = (Date.now() - lastNewsPos) / 1000;
  lastNewsPos = Date.now();
  newsPosition -= diff * 160;
  ticker.changeStyle("left", `${newsPosition}px`);

  if (!player.news) return;
  if (newsPosition < -tickerContainer.offsetWidth) newNewsMessage();
}

function newNewsMessage() {
  const newsCandidates = [];
  for (const i of messages) {
    if (typeof i === "undefined") {
      console.warn(
        "NEWS TICKER HAS UNDEFINED ENTRIES at index " + messages.indexOf(i)
      );
      continue;
    }
    if (typeof i === "string" || i[1] === undefined || i[1]()) {
      newsCandidates.push(typeof i === "string" ? i : i[0]);
    }
  }
  ticker.writeHTML(random(newsCandidates));
  newsPosition = tickerContainer.offsetWidth;
}

function startNews() {
  ticker = tmp.cache.news_ticker;
  tickerContainer = tmp.cache.news_ticker_base.el;
  setInterval(tickNews, 10);
}
