const messages = [
  // these tickers require something to be unlocked
  ["Why are you not generating points at all?", () => Decimal.eq(player.points, 10)],
  ["You have more points than the amount of atoms in the observable universe", () => Decimal.gte(player.points, 1e80)],
  ["What's the point of large numbers if there are larger ones?", () => Decimal.gte(player.points, 1e100)],
  ["Where is my big crunch?", () => Decimal.gte(player.points, Number.MAX_VALUE)],
  ["Tip: Try to maximize Enhancements onto Generators until Upgrade 6", () => player.boost.unl],
  ["Tip: Only consume once until we edit this news message.", () => L1_CONSUME.unl()],
  ["Creator reports that boosters aren't a effective way.", () => L1_CONSUME.unl()],
  ["Dark Energy? Why not Light Energy?", () => L1_CONSUME.unl()],
  ["You have 8 minutes left to live.", () => player.dark.unl],
  ["You are one with the Dark.", () => player.dark.unl],
  ["Hey, who turned off the lights?", () => player.dark.unl],
  ["At least you saw the eternal nightfall.", () => player.dark.unl],
  ["Darkning? Huh?", () => player.dark.unl],
  ["Abilities aren't passive. At least you get activity for you.", () => hasUpg(2, "dark")],
  ["Now, we are recalling for more darkness!", () => hasUpg(2, "dark")],
  ["Hey! Where did the Dark go missing?", () => hasUpg(2, "dark")],
  ["Harvesting dark matter, recalling for supplies...", () => hasUpg(2, "dark")],
  ["Do you realize it's a farming soruce for the Dark?", () => hasUpg(2, "dark")],
  ["The Dark's needed supply was overloaded...", () => hasUpg(2, "dark")],
  ["Hey! You can fuse things into things now! Yippee!", () => hasUpg(7, "dark")],
  ["Fusing is life.", () => hasUpg(7, "dark")],
  ["I see you didn’t even stop at all. Go leave and GET A LIFE!", () => gameEnded()],
  ["If you see this in the game, i will give you beta tester role (or 0.25 personal role).", () => gameEnded()&&Math.random() < 0.1],
  // these tickers require specific settings
  ["You know your life rests in how much you do, right?", () => player.theme === "wannacry"],
  ["have you ever tried changing the theme? it's in settings.", () => player.theme === "default"],
  ["have you ever tried unchanging the theme? it's in settings.", () => player.theme !== "default"],
  
  // these tickers are always shown
  ["Longest Incremental Game ma balls"],
  ["Inslated"],
  ["that has already been added"],
  ["Rickrolls are fun. Did you know that you have a small chance to get rickrolled?"],
  ["dry boomer aarex"],
  ["aarex is lightning?! :scream:"],
  ["we hope this is the longest incremental"],
  ["thats what i was gonna do :skull:"],
  ["wtf is a news_ticker_base"],
  ['"we should probably fix the game first" -randomtuba'],
  ["Casual gamers decided to quit this incremental game due to infinite amount of content."],
  ["You have almost infinite layers left to reach the summit."],
  ["why are we making this with no payment, no monetary value, no reward?? -someone who delves on life"],
  [`"Here's a tip: Life is ambiguous." - some nerd`],
  ["Creator admits that there is a bug. Gamers are outraged."],
  ["There are 1.79e308 bugs, multiplying development speed by 0."],
  ["when the developers don't know what to develop, they just add more news tickers."],
  ["why can't i fucking CONTRIBUTE - CRG"],
  ["gwa"],
  [":ungwa:"],
  [" ".repeat(200) + "you thought this news ticker was empty?"],
  ["Have you played Ordinal Markup yet?"],
  ["j"],
  ["the j is real"],
  [`we do a lot of trolling <img src="${imageMap("troll")}" />`],
  [`What is the point of a news ticker? Is it to distract you? To make jokes? Or is it something else? Or is it <img src="${imageMap("troll")}" />-ing?`],
  ["the 9th dimension does not exist"],
  ["the 9th dimension does exist"],
  ["yes, we do dilate time."],
  ["this is most useless news ticker"],
  ["this is most useful news ticker"],
  ["paradoxes 69: this is not a paradox"],
  ["paradoxes 420: this is a paradox"],
  ["paradoxes 69420: gwa isn't real"],
  ['"why is it broken?" -developers'],
  ["well, since you're reading this I'm sorry to say this is pointless to read so just move along and ignore this. Wait, you're still here? I said move along, there's nothing here. Ok, go to hell now!!"],
  ['"these are all unfunny" -randomtuba'],
  ["BREAKING NEWS: Local developer has been found guilty of resetting saves, community shocked and outraged"],
  ["what happens next will shock you"],
  ["Fact: Do you know that Longest Incremental has too many layers?"],
  ["this game is just a layer simulator"],
  ["this is 50th news ticker to be added"],
  ["Did you know that there are now 1 devs, not 2, not 3, not... (to be continued)"],
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
  ["<a href='javascript:(function(){rickroll()})()'>click here for free gwa!</a>"],
  ["<a href='javascript:(function(){rickroll()})()'>do you know what ehehe in di is?</a>"],
  ["too short 1/0"],
  ["how much boost could a boosted booster boost if a booster could boost boosts"],
  ["How many ticks can a tick tick at?"],
  ['"DEEFAT" -crg'],
  ["Next update in 4.8 hours"],
  ["Ow, that hurt! Stop clicking me!"],
  ["ae".repeat(100)],
  ["imagine a newsticker that says 'j'"],
  [`imagine a newsticker that says "imagine a newsticker that says 'j'"`],
  ["you are very cool!"],
  ["Going horizontal is fun! Weeeeeeeeeeeeee!"],
  ["do it that way we can put memes in general"],
  ["There are a total of 2 layers in the longest incremental game. Does that mean it's shorter than 3 layers tree?"],
  ["We will get cancelled for this, but a layer is a layer, size & age doesn't matter, a new layer is as important as the oldest layer"], 
  ["softcaps are terrible for balancing"],
  ["incremental is just advanced waiting"],
  ["imagine a game with over 1 thousand different news ticker messages but only three layers of prestiging"],
  ["adding news tickers might have been a bad idea"],
  ["this game is written on glitch.com (at least when writing this news ticker)"],
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
  ["You've just been news tickered, send a screenshot of this news ticker to get un-news tickered"],
  ["will there be a person who really wait 5 hours to see the game loading?"],
  ["did you know softcaps are bad for your health?"],
  ["When you get e^100 points, all your bugs will be gone."],
  ["Cthulhu is here"],
  ["Hello. This is You from the future. The 5 hour update is finally here.                              Sorry, the last message was an accident, the update is always in 5 hours, it has never nor will it ever come out."],
  ["Capybaras are the cutest animal."],
  ["If a cow isn't a dog, then is a lion just a small elephant?"],
  ["BLOOD FOR THE BLOOD GOD"],
  ["Imagine a world without bugs, we'd be the closest we ever got to world peace"],
  [":flushed:"],
  ["meta has a great singing voice, you should listen to it"],
  ["[this news ticker is left intentionlly blank]"],
  ["when you forget to put the \" at the end of a string"],
  ["If you're paid hourly, don't forget to not put a \ at the end of a string"],
  ["Oh no we're out of content ideas."],
  ["You think your news ticker can be longer than the bee movie script? Good luck!"],
  ["A".repeat(50) + " SOMEONE HELP"],
  ["Developers who make too many news tickers and implement a bit of content..."],
  ["Boy what the hell boy :raised_eyebrow:"],
  ["Inslation"],
  ["bugs never lie - some bug"],
  ["Welcome to the longest incremental game, hope you enjoy!"],
  ["‘When I grow up, I want to destroy (softcapped) and (hardcapped)!’ -young boy that’s 5 years old and plays this game"],
  ["“I see you didn’t even stop at all. Go leave and GET A LIFE!”"],
  ['"Consume Boosters. sacrificed remaining" - the game. In other news, you just lost The Game'],
  ['Boosters, Darken, Elemental, Ascend? Freedom awaits for me!'],
  ['A is Ascend, B is Boosters, C is... [missing], D is Darken, and E is Elemental.'],
  ['Fact: We can generate random layer names when we ran out of ideas.'],
  ['This game is planned to beat AD: NG-5+3 in length.'],
  ['Altar awaits your recall...'],
  ['Somebody just Boosted our production, be one with the Dark, got Elements from his imagination, Extended our game, and Ascended to Heaven...'],
  ['A forbidden ghost scientist went into Elemental Tree to find spectral matter.'],
  ['Lightnize: Become the thunderous Lightning.'],
  ["Sextillions are better without the tillions!"],
  ["Banana monke make dart go brrr, balloon scared"],
  ["'I'm the son of Zeus!' ~ A person who doesn't know Greek gods"],
  ["Guns! Guns! Guns! Gu- This news ticker has been removed for being too offensive."],
  ["Hey, what's the opposite of defensive? Of-[This user has been banned from the news tricker community]"],
  ["DEEFAT nuts"],
  ['"You have reached Infinity, and I shall endor- wait wrong game" - Infinity'],
  ["/g/ approves!"],
  ["IROwO"],
  ["Having a cow is nice!"],
  ["Almost everybody that breathes air dies! Stop breathing now."],
  ["You don't need a parachute to go skydiving, you only need a parachute to do it multiple times"],
  ["DHMO (Dihydrogen Monoxide) is the most dangerous substance known, for more info visit <a herf='www.dhmo.org'>www.dhmo.org</a>"],
  ["We have to talk about the elephant in the room. His name is Greg and he is 4 year old."],
  ["This News Ticker has to be left blank for legal reasons... oh shit"],
  ["Why are you reading this" + "?".repeat(10)],
  ["Most dead people aren't alive!"],
  ["You might have won, but you... won? I forgor the phrase"],
  ["'No. No more tickers. I won't allow it. You have sinned.''-boringloser49"],
  ["What's a game without tickers just ticking"],
  ["I had an idea, but was called crazy. What if we had an actual clock ticker, just ticking? :D"],
  ["Apparently some tickers are just emojis, but it seems to be a myth! Nobody came across one yet"],
  ["New Ticks Ticks Newly Ticking Tickers"],
  ["Tickies!"],
  ["Why did America lose in a fight with North Korea?                                       ...wait, did they?"],
  ["The update is always 4 hours, 30 minutes, 1,200 seconds and 600,000 milliseconds away!"],
  ["YOU KNOW WHAT I HATE???! Timewalls!!!"],
  ["ᯡࠣ䈌ঀ㬡㠹戡㡠⌠ీڤĸ֐਀ჯVŬ䭊୴嬆䔱ಠথ嬣ᣙ戠ି⸢〡映乄m呱检抌害夺⹾摋˴䀥〸΀ᠮ智ᾢȢᱥအ䘰〡䳁␥壃㥎₩◣䅡㵈⡆n①ຠǡ䚪❅⎣K摣ৎ੺䜢⊰㪋㦐⑾⋶㼡ؼ䊧ʰᄧ瀩༔䫵͟Ͳ嶂熠‱䌼攵㙪త侬⥈嘶妘䠠Ḡֈ㰭ᴫං⊐x倡娢沓㘪䭽䶢⻫䞂⏑ᠯⵔॺ᭐愚㾇Ἵ冏沈7⮧塨䑃䈲ධ獄⁁ᡐᣗ෠ࡐ呦C⅂沨Ôⱸ㢬⺄ᣰ䍁仧ᏸ㢩ḗ᥈㉨ඃ䆖䨴ሧ䤜əąᐨ㠤Ñռ㹤䅂农... yes, this is how saves looked like when this game is released."],
  ["I wonder that will someone refresh the page a lot of times just for you to see some new title of this game."],
  ["Who doesn't like a long incremental game?"],
  ["how to make the longest incremental: just add a millenium long timewall"],
  ['"The Billion-Year Incremental when" -Meta (20% discount for immortal people!)'],
  ["'So I can play this game till I die, and I still can’t complete it? Oh, that’s a funny joke.' -literally everyone"],
  ["This game is more than five hours"],
  [`"new rule: no news tickers longer than 500 characters" Okay, uhhhhhh... so I need to make this shorter than 500 characters? That's going to be an annoying job, but fine, I guess. Anyway, how's your day? It's probably better than mine. This is honestly a pretty long game, but it's nowhere NEAR the top. After all, Synergism exists, a game which has 5 layers and lasts for months. If we expand the suffering enough, we might be able to beat that. Oh, oops, I'm approaching the 500 character limit, aaaaaaaand there we go. Have a nice day! [minute wait] Jeez, that was a LONG news ticker.`],
  ["while (true) {bugs=bugs+1}"],
  [":unungwa:      wait, isn't that just :gwa:?"],
  ["NEW UPDATE: v4.7 (gwa layer update)"],
  ["At last, we are longer than the reality update in antimatter dimensions!"],
  ["Don’t upvote this, how is he supposed to implement <i>this</i> into the game?!?!"],
  ["??????? 9,122: ??????s the game with 12 - 54 new features for every prior layer and unlocks Layer 9,125."], //DUDE THIS IS A SPOILER AAAAAAAAAAAAAAA
  ["Balancing patch: Reduced the OP for multiplier boosts."],
  ["Layer, extend, profit."],
  ["Fly away, zappies! ~ Aarex"],
  ["If you think there is a lot of spoiler in news, you are wrong. They are plans and just leaded it accidantly. But after we added it, that become spoiler and we forget to add req on it."],
  ["Did you know that the news ticker contains spoilers for future updates? Better memorize them now before people remove this!"],
  ["my gramma was baded. Guessed who was my?"],
  ["Good job even trying, you cannot complete this."],
  ["The game would probably load a few milliseconds faster if these weren't present."],
  ["no we are suggesting news tickers"],
  ['"no we are suggesting news tickers" - people when they don\'t want to get caught chatting in here"'],
  [`"Uncaught BugError: bug occured"`],
  ["Imagine someone pinging in the code editor (it really happened before but whatever)"],
  ["// @yyyy7089#7238 fix this bug"],
  [">bruh"],
  ["No cap"],
  ['"add this one" - ngX'],
  ["Let's softcap the newsticker, cause why not?"],
  ["The only thing that does not get softcapped in earth, is newsticker amount."],
  ["Suggest news tickers <a href='https://discord.gg/GBHavRPeke'>here!</a>"],
  ["Our planning document is longer than the game itself!"],
  
  // these tickers are from #news-ticker-suggestion
  ['Wait 3^3-2 hours to have a new update! (Not 5 hours, trust me)'],
  ['"adhere to the spirit of the rules, not the letter" - no one, ever'],
  ["(trollcapped)"],
  ["1+1=1.1 (softcapped)"],
  ["haha you still can’t progress lol"],
  ["Go on. Progress now. You can’t? Good. - (softcapped) and (hardcapped)"],
  ["Did you know that the most spoken conlang is the Indonesian language? You probably never needed to know that in your LIFE, but now you know anyway."],
  ["the only game where to be a dev you only need to have a search engine and break_eternity.js"],
  ["This game takes more than 5 hours, trust me"],
  ["Next update in NaN hours"],
  ["help"],
  [":аughhhhhhhhhhhhhhhhhhhhhhhhhhhhh:"],
  ["I swear, are we going to chat in this channel and submit all this as news tickers???????"],
  ["top news bottom news"],
  ["Here's a hidden tip! Stop reading the news"],
  ["this game is sus"],
  ["I sure love Generak"],
  
  ////these tickers require luck
  ["It's Morbin Time!!", () => Math.random() < 0.1],
  ["You have gotten very lucky.", () => Math.random() < 0.01],
  ["There is a 0.1% chance of seeing this message. That's the same chance as the title of this game being 'Trollcremental 2'.", () => Math.random() < 0.001],
  ["Go buy a lottery ticket.", () => Math.random() < 0.0001],
  ["Hey you just won a lottery.", () => Math.random() < 0.000001],
  ["Rickroll yourself to get rid of this news ticker. ".repeat(50), () => Math.random() < 0.0000001],
  ["Hey you just won two lotteries in a row.",() => Math.random() < 0.00000000001],
  [
    "Your luck skills broke the multiverse. Report this on the Discord if this happens.",
    () => {
      const val = Math.random() < 1e-30;
      if (val) rickroll();
      return val;
    },
  ], // it happened in jacorb's server (wait, did it get "zero"?)
  [
    "Your luck skills broke the megaverse. PLEASE REPORT THIS ON THE DISCORD IF THIS HAPPENS.",
    () => {
      const val = Math.random() < 1e-300;
      if (val) rickroll();
      return val;
    },
  ],
  // impossible news tickers
  ["You'll never see this!", () => !player.news],
  ["The impossible happened.", () => Math.random() < 0],
  ["If you see this you deserve a hard reset", () => false],
  [
    "If you see this yell at the dev(s) to make more news tickers",
    () => messages.length < 200,
  ],
]

messages.push([
  `funny fact: there are ${
    messages.length + 1
  } news ticker messages, but only 2 of them gives you actual tips, the rest of them are either jokes or trolls`,
  () => true,
]);

function getNextNews() {
  return random(messages);
}

function scrollTicker() {
  if(typeof tmp === 'undefined' || !tmp.cache["news_ticker"]){
    setTimeout(scrollTicker, 50)
    return
  }
  let message = getNextNews();
  while (message.length > 1 && !message[1]()) {
    // no longer need the () => true for tickers that are always shown
    message = getNextNews();
  }
  const ticker = message[0];
  const duration = Math.min(600, 10 + 0.1 * ticker.replace(/<.*?>/g, "").length);
  tmp.cache["news_ticker"].writeHTML(ticker);
  tmp.cache["news_ticker"].changeStyle("animation","none")
  setTimeout(function() {tmp.cache["news_ticker"].changeStyle("animation",`${duration}s linear infinite normal none running news_ticker`)},1)

  setTimeout(scrollTicker, (duration * 1000) + 1);
}

function toggleNews() {
  if (player.news) {
    player.linearNews = !player.linearNews
    if (player.linearNews) player.news = false
  } else player.news = !player.news
}

// it works like that
scrollTicker()