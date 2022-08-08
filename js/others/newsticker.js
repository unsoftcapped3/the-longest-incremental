//stop messing up ~ Aarex / Lightning
// its not me, but i think its the guy called drew01547 - jwklong
// it's not me either - incremental_gamer (also i'm drew01547)
// its not me either - yyyy
const messages = [
  // these tickers require something to be unlocked
  ["Why are you not generating points at all?", () => Decimal.eq(player.points, 10)],
  ["What's the point of large numbers if there are larger ones?", () => Decimal.gte(player.points, 1e100)],
  ["Where is my big crunch?", () => Decimal.gte(player.points, Number.MAX_VALUE)],
  ["Tip: Try to maximize Enhancements onto Generators until Upgrade 6", () => player.boost.unl],
  ["Creator reports that boosters aren't a effective way.",() => L1_CONSUME.unl()],
  ["Dark Energy? Why not Light Energy?", () => L1_CONSUME.unl()],
  ["You have 8 minutes left to live.", () => player.dark.unl],
  ["You are the one with the Dark.", () => player.dark.unl],
  // these tickers require specific settings
  ["You know your life rests in how much you do right?", () => player.theme === "wannacry"],
  ["have you ever tried changing the theme? it's in settings.", () => player.theme === "default"],
  ["have you ever tried unchanging the theme? it's in settings.", () => player.theme !== "default"],
  ["You'll never see this!", () => !player.news],
  // these tickers are always shown
  ["Longest Incremental Game ma balls"],
  ["Rickrolls are fun. Did you know that you have a small chance to get rickrolled?",],
  ["dry boomer aarex"],
  ["we hope this is the longest incremental"],
  ["thats what i was gonna do :skull:"],
  ["wtf is a news_ticker_base"],
  ['"we should probably fix the game first" -randomtuba'],
  ["Casual gamers decided to quit this incremental game due to infinite amount of content.",],
  ["You have almost infinite layers left to reach the summit."],
  ["why are we making this with no payment, no monetary value, no reward?? -someone who delves on life"],
  [`"Here's a tip: Life is ambiguous." - some nerd`],
  ["Creator admits that there is a bug. Gamers are outraged."],
  ["There are 1.79e308 bugs, multiplying development speed by 0."],
  ["when the developers don't know what to develop, they just add more news tickers."],
  ["why can't i fucking CONTRIBUTE - CRG"],
  ["gwa"],
  [":ungwa:"],
  [" ".repeat(100) + "you thought this news ticker was empty?"],
  ["Have you played Ordinal Markup yet?"],
  ["j"],
  ["the j is real"],
  [`we do a lot of trolling <img src='${imageMap("troll")}'></img>`],
  ["the 9th dimension does not exist"],
  ["the 9th dimension does exist"]
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
  ["this game's code is written in... brainfuck."],
  ["this game's code is written in... pineapples."], //can confirm <- do it
  ["<a href='javascript:(function(){rickroll()})()'>click here for free gwa!</a>",],
  ["<a href='javascript:(function(){rickroll()})()'>do you know what ehehe in di is?</a>",],
  ["too short 1/0"],
  ["how much boost could a boosted booster boost if a booster could boost boosts"],
  ["How many ticks can a tick tick at?"],
  ["Next update in 4.8 hours"],
  ["Ow, that hurt! Stop clicking me!"],
  ["ae".repeat(100)],//this is offensive /j because ae is offensive /j
  ["imagine a newsticker that says 'j'"],
  [`imagine a newsticker that says "imagine a newsticker that says 'j'"`],
  ["you are very cool!"],
  ["Going horizontal is fun! Weeeeeeeeeeeeee!"],
  ["do it that way we can put memes in general"],
  ["There are a total of 2 layers in the longest incremental game. Does that mean it's shorter than 3 layers tree?"],
  ["We will get cancelled for this, but a layer is a layer, size & age doesn't matter, a new layer is as important as the oldest layer"], //this ^
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
  ["Longest Incremental Game? More like shortest incremental game"],
  ["You've just been news tickered, send a screenshot of this news ticker to get un-news tickered"],
  ["will there be a person who really wait 5 hours to see the game loading?"],
  ["did you know softcaps are bad for your health?"],
  ["When you get e^100 points, all your bugs will be gone."],
  ["Cthulhu is here"],
  ["Cthlhlhlthhlthulhlthlthlu is here (that's how you spell it, right?)"],
  ["Hello. This is You from the future. The 5 hour update is finally here.                                                     Sorry, the last message was an accident, the update is always in 5 hours, it has never nor will it ever come out."],
  ["Capybaras are the cutest animal."],
  ["If a cow isn't a dog, then is a lion just a small elephant?"],
  ["BLOOD FOR THE BLOOD GOD"],
  ["Imagine a world without bugs, we'd be the closest we ever got to world peace"],
  [":flushed:"],
  ["[this news ticker is left intentionlly blank]"],
  ["STR 24 (+7)"],
  ["DEX 17 (+3)"],
  ["CON 30 (+10)"],
  ["INT 15 (+2)"], 
  ["WIS 14 (+2)"],
  ["CHR 18 (+4)"], //Dungeons & Dragon reference news tickers
  ["when you forget to put the \" at the end of a string"],
  ["If you're paid hourly, don't forget to not put a \ at the end of a string"],
  ["Oh no we're out of content ideas."],
  ["CRG Says: There's really no reason as to why the Longest Incremental should have short news tickers. In fact, a game designed to be long should have long snippets of text, which are in the form of news tickers, so this will be the longest news ticker in the Longest Incremental Game. To make it longer here's my favourite achievement in Cookie Clicker: There's really no hard limit to how long these achievement names can be and to be quite honest I'm rather curious to see how far we can go. Adolphus W. Green (1844–1917) started as the Principal of the Groton School in 1864. By 1865, he became second assistant librarian at the New York Mercantile Library; from 1867 to 1869, he was promoted to full librarian. From 1869 to 1873, he worked for Evarts, Southmayd & Choate, a law firm co-founded by William M. Evarts, Charles Ferdinand Southmayd and Joseph Hodges Choate. He was admitted to the New York State Bar Association in 1873. Anyway, hows your day been? This achievmeent is for baking 10 sextillion cookies per second. This is CRG, signing off for the longest news ticker in the Longest Incremental. If there is a ticker longer than this, it can fu-"]
  ["A".repeat(50) + " SOMEONE HELP"],
  ["Developers who make too many news tickers and implement a bit of content..."],
  ["According to all known laws of aviation, there is no way that a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway. Because bees don’t care what humans think is impossible."],
  ["Sextillions are better without the tillions!"],
  ["Banana monke make dart go brrr, balloon scared"],
  ["'I'm the son of Zeus!' ~ A person who doesn't know Greek gods"],
  ["Being offensive really makes me snigger and want to report."], //"snigger" is a small, faint laugh, not a slur
  ["Guns! Guns! Guns! Gu- This news ticker has been removed for being too offensive."] //It's a joke, "transgender people" and "people" isn't a gender
  ["Trans people don't exist                  Because people isn't a gender, we do support trans men, women, and everything in between."],// it's literally transphobia bait
  //transphobic messages are considered offensive
  ["Hey, what's the opposite of defensive? Of-[This user has been banned from the news tricker community]"] 

  //these tickers require luck
  ["You have gotten very lucky.", () => Math.random() < 0.01],
  ["There is a 0.1% chance of seeing this message. That's the same chance as the title of this game being 'Trollcremental 2'.", () => Math.random() < 0.001],
  ["Go buy a lottery  ticket.", () => Math.random() < 0.0001],
  ["Hey you just won a lottery.", () => Math.random() < 0.000001],
  ["Hey you just won two lotteries in a row.",() => Math.random() < 0.00000001],
  [
    "Your luck skills broke the multiverse",
    () => {
      const val = Math.random() < 1e-30;
      if (val) rickroll();
      return val;
    },
  ], // it happened in jacorb's server (wait, did it get "zero"?)
  ["The impossible happened.", () => Math.random() < 0],
  ["If you see this you deserve a hard reset", () => false],
  [
    "If you see this yell at the dev(s) to make more news tickers",
    () => messages.length < 80,
  ],
];

messages.push([
  `funny fact: there are ${
    messages.length + 1
  } news ticker messages, but only 1 of them gives you actual tips, the rest of them are either jokes or trolls`,
  () => true,
]);

function getNextNews() {
  return random(messages);
}

function scrollTicker() {
  let message = getNextNews();
  while (message.length > 1 && !message[1]()) {
    // no longer need the () => true for tickers that are always shown
    message = getNextNews();
  }
  const ticker = message[0];
  const duration = 10 + 0.1 * ticker.replace(/<.*?>/g, "").length;
  tmp.cache["news_ticker"].writeHTML(ticker);
  tmp.cache["news_ticker"].changeStyle(
    "animation-duration",
    duration.toString() + "s"
  );

  setTimeout(scrollTicker, duration * 1000);
}
// it works like that
setTimeout(scrollTicker, 100);
