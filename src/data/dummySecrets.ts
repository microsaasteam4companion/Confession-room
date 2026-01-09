import { SecretData } from '@/utils/secretUtils';

// Helper to create dummy item structure
const createDummy = (id: string, categoryId: string, text: string, name: string, avatar: string, votes = 0, reactions = { hug: 0, shock: 0, relatable: 0 }) => ({
    id: `dummy-${id}`,
    content: JSON.stringify({
        text,
        categoryId,
        identity: { name, avatar },
        reactions
    } as SecretData),
    created_at: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString(), // Random past time
    votes,
    isDummy: true
});

export const DUMMY_SECRETS = [
    // --- 💜 The Regret Room (Deep, Dark, Emotional) ---
    createDummy('r1', 'regret', "I broke up with my soulmate because they were 'too nice' and I wanted drama. Now I'm 35, alone, and the drama is just my anxiety.", "Hollow Heart #92", "💔", 842, { hug: 415, shock: 50, relatable: 377 }),
    createDummy('r2', 'regret', "I stole my sister's inheritance money to fund a startup that failed in 3 months. She still thinks the bank made an error. I can never tell her.", "Guilty Shadow #44", "🌑", 1205, { hug: 10, shock: 950, relatable: 245 }),
    createDummy('r3', 'regret', "I ghosted my best friend of 10 years just because their depression was 'bumming me out'. I am the villain in their story.", "Toxic Ghost #12", "👻", 670, { hug: 20, shock: 400, relatable: 250 }),
    createDummy('r4', 'regret', "Cheat on my wife? No. But I have an entire emotional life with a woman online who knows me better than she ever will.", "Digital Cheater #77", "🎭", 930, { hug: 50, shock: 300, relatable: 580 }),
    createDummy('r5', 'regret', "I let my dog run away because I couldn't afford the vet bills anymore. I told everyone he was stolen. I cry every night.", "Broken Human #01", "🥀", 2100, { hug: 1500, shock: 500, relatable: 100 }),
    createDummy('r6', 'regret', "I laughed at the quiet kid in high school to impress the bullies. He's a millionaire now and I'm asking him for a job on LinkedIn.", "Karma served #33", "🤡", 450, { hug: 10, shock: 430, relatable: 10 }),

    // --- 🔥 The Hot Take (Controversial, Spicy, Rage-Bait) ---
    createDummy('h1', 'hot_take', "Taylor Swift is the musical equivalent of unseasoned boiled chicken. You're not a swiftie, you're in a cult.", "Rogue Critic #99", "🎤", 5015, { hug: 0, shock: 3000, relatable: 2015 }),
    createDummy('h2', 'hot_take', "Cheating is actually a biological imperative and monogamy is a scam invented by capitalism to sell houses.", "Chaos Theory #55", "🧨", 980, { hug: 20, shock: 800, relatable: 160 }),
    createDummy('h3', 'hot_take', "Parents who put their kids on leashes are actually the smartest people in society. Kids are just tiny drunk suicide machines.", "Leash Logic #22", "🐕", 1200, { hug: 100, shock: 200, relatable: 900 }),
    createDummy('h4', 'hot_take', "Marvel movies stopped being cinema after Iron Man 1. Now it’s just military propaganda with CGI capes.", "Film Snob #07", "🎬", 340, { hug: 40, shock: 100, relatable: 200 }),
    createDummy('h5', 'hot_take', "Tipping culture needs to die. I’m not paying your salary just because your boss won’t. I’m keeping my 20%.", "Mr Pink #88", "💵", 2500, { hug: 1500, shock: 800, relatable: 200 }),
    createDummy('h6', 'hot_take', "Remote work is destroying society. You're not 'more productive', you're just doing laundry and napping.", "Office Narc #11", "🏢", 150, { hug: 0, shock: 140, relatable: 10 }),

    // --- 👔 The Office Bitch-Room (Work Rants, Petty) ---
    createDummy('o1', 'office', "I mute myself on Zoom calls and play video games. I've finished 3 RPGs this quarter and got a promotion.", "Corporate Gamer #23", "🎮", 1400, { hug: 100, shock: 200, relatable: 1100 }),
    createDummy('o2', 'office', "I deliberately schedule meetings at 4:55 PM on Fridays just to watch the light die in my coworkers' eyes.", "Satan in HR #66", "😈", 3000, { hug: 0, shock: 2900, relatable: 100 }),
    createDummy('o3', 'office', "My boss thinks I'm working late. I'm actually using the office wifi to mine crypto on the company servers.", "Crypto Rebel #42", "💰", 890, { hug: 90, shock: 600, relatable: 200 }),
    createDummy('o4', 'office', "I stole the expensive ergonomic chair from my boss's office and swapped it with mine. He thinks he shrank.", "Chair Thief #09", "🪑", 1100, { hug: 100, shock: 100, relatable: 900 }),
    createDummy('o5', 'office', "To Susan, who keeps heating up fish in the microwave: I am the one expensing 'Air Freshener' to your project code.", "Nose Enforcer #51", "🐟", 670, { hug: 200, shock: 70, relatable: 400 }),

    // --- 👨‍👩‍👧 The Family Drama (Toxic, Secrets) ---
    createDummy('f1', 'family', "I found out my 'Dad' isn't my bio dad. My mom had an affair with the neighbor. The neighbor is my wife's uncle. Help.", "Gene Pool #91", "🧬", 5000, { hug: 4000, shock: 990, relatable: 10 }),
    createDummy('f2', 'family', "I’m the reason my parents got divorced. I planted the lipstick in my dad's car because he wouldn't buy me a PS5.", "Evil Child #66", "💄", 3200, { hug: 0, shock: 3100, relatable: 100 }),
    createDummy('f3', 'family', "My mother-in-law wore white to my wedding. I 'accidentally' spilled red wine on her. Best day of my life.", "Wine Warrior #33", "🍷", 2800, { hug: 500, shock: 300, relatable: 2000 }),
    createDummy('f4', 'family', "My brother is the 'golden child' who went to Harvard. He's actually in jail in Mexico. I send the fake postcards.", "Postcard Liar #12", "📬", 1500, { hug: 200, shock: 1000, relatable: 300 }),
    createDummy('f5', 'family', "I switch the sugar for salt when my stepmom bakes. She thinks she's losing her mind. I call it justice.", "Salty Kid #08", "🧂", 900, { hug: 300, shock: 300, relatable: 300 }),

    // --- 🌙 3 AM Thoughts (Existential, Weird) ---
    createDummy('m1', 'midnight', "Do you think our pets have names for us? Or are we just 'The Food Bringer' and 'The Backup Food Bringer'?", "Stoned Philosopher #42", "🐕", 1300, { hug: 300, shock: 100, relatable: 900 }),
    createDummy('m2', 'midnight', "We celebrate birthdays, which is basically a countdown to our death. Humans are weirdly morbid.", "Grim Thinker #11", "🎂", 450, { hug: 50, shock: 100, relatable: 300 }),
    createDummy('m3', 'midnight', "If you punch yourself and it hurts, are you weak or strong?", "Confusion #99", "🥊", 600, { hug: 100, shock: 100, relatable: 400 }),
    createDummy('m4', 'midnight', "Somewhere out there is a tree tirelessly producing oxygen so you can breathe. I think I owe it an apology.", "Oxygen Thief #22", "🌳", 2000, { hug: 1000, shock: 50, relatable: 950 }),
    createDummy('m5', 'midnight', "Mirrors don't break, they multiply. That's terrifying.", "Glass Eye #88", "🪞", 780, { hug: 50, shock: 430, relatable: 300 }),

    // --- Ghosts Into The Void (Random) ---
    createDummy('v1', 'void', "I have $4 in my bank account and I just ordered a $30 pizza. Future me is going to hate Present me.", "Broke & Hungry #01", "🍕", 3500, { hug: 1500, shock: 200, relatable: 1800 }),
    createDummy('v2', 'void', "I judge people by their shoes. If you're wearing Crocs in public, I assume you've given up on life.", "Shoe Snob #77", "🐊", 400, { hug: 10, shock: 300, relatable: 90 }),
    createDummy('v3', 'void', "Sometimes I just want to move to a cabin in the woods and scream at squirrels.", "Forest Scream #55", "🌲", 1800, { hug: 500, shock: 100, relatable: 1200 }),
];
