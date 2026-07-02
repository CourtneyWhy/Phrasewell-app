import type { BlogPostSection } from "@/app/lib/blog/types";
import { faq, h2, h3, link, p, quote, source, step, strong, txt, ul } from "@/app/lib/blog/helpers";

const CMI =
  "https://childmind.org/article/why-do-kids-have-tantrums-and-meltdowns/";
const THINK_KIDS = "https://thinkkids.org/regulate-relate-reason/";
const HARVARD_COREG =
  "https://www.health.harvard.edu/blog/co-regulation-helping-children-and-teens-navigate-big-emotions-202404033030";
const HARVARD_SERVE =
  "https://developingchild.harvard.edu/key-concept/serve-and-return/";

export const SOBBING_MELTDOWN_SECTIONS: BlogPostSection[] = [
  p(txt("You have probably been there.")),
  p(
    txt(
      "Your child is sobbing so hard they can barely talk. Maybe they are curled up on the floor. Maybe they are yelling the same thing over and over. Maybe they are hiding, clinging, pushing you away, or doing all of it at once.",
    ),
  ),
  p(txt("And your own brain starts racing.")),
  p(
    txt(
      "What happened? Are they okay? Do I comfort them? Do I correct them? Do I ignore it? Am I making this worse?",
    ),
  ),
  p(
    txt(
      "A complete sobbing meltdown is one of those parenting moments where it is really easy to say too much.",
    ),
  ),
  p(txt("I know because I have done it.")),
  p(
    txt(
      "You are trying to help. You are trying to calm them down. You are trying to figure out what happened, what they need, and how to make it stop. So you start talking.",
    ),
  ),
  p(strong("“Calm down.”"), txt(" "), strong("“You’re okay.”"), txt(" "), strong("“Use your words.”"), txt(" "), strong("“Tell me what happened.”")),
  p(
    txt(
      "But once a child is that upset, they usually cannot take much in. Their body is overloaded. Their brain is not ready for a lesson. They may not even know what they need yet.",
    ),
  ),
  p(txt("This is where I try to remember one simple thing:")),
  p(strong("This is not the teaching moment."), txt(" "), strong("This is the settling moment.")),

  h2("A meltdown is not a conversation yet"),
  p(
    txt(
      "When a child is fully sobbing, it can look like they are refusing to listen. But a lot of the time, they are not choosing not to listen. They are overwhelmed.",
    ),
  ),
  p(
    txt(
      "The Child Mind Institute explains that tantrums and meltdowns often happen when children cannot manage big emotions, communicate what they need, or calm themselves down.",
    ),
  ),
  source("Child Mind Institute: Why do kids have tantrums and meltdowns?", CMI),
  p(txt("That does not mean every behavior is okay. It means the order matters.")),
  p(strong("First, they need help settling."), txt(" "), strong("Then they can learn.")),
  p(
    txt(
      "Dr. Bruce Perry’s approach is often summarized as: Regulate. Relate. Reason. In plain language, that means a child usually needs to be calm enough before they can connect, listen, or think through what happened. Think:Kids explains that people must be regulated before they can relate to another person’s perspective or use reasoning skills.",
    ),
  ),
  source("Think:Kids: Regulate, relate, reason", THINK_KIDS),
  p(txt("That is why “calm down” usually does not work. It asks for the final step first.")),

  h2("The best first script for a sobbing meltdown"),
  p(txt("When your child is crying hard and nothing seems to help, try this:")),
  quote("I’m here. You are safe. We can slow this down together."),
  p(txt("Then pause.")),
  p(txt("That pause matters. Not a cold pause. Not a punishing pause. Just enough quiet to stop adding more sound to an already overwhelmed body.")),
  p(txt("You are not trying to win the moment. You are not trying to explain the whole lesson. You are giving your child one steady sentence they can come back to.")),
  p(txt("Try saying it slowly.")),
  p(strong("“I’m here.”"), txt(" "), strong("“You are safe.”"), txt(" "), strong("“We can slow this down together.”")),
  p(txt("That may be enough for the first minute.")),

  h2("Why short scripts help more than long explanations"),
  p(txt("When kids are overwhelmed, more words can feel like more pressure. Even good words. Even true words. Even thoughtful parenting words.")),
  p(
    txt(
      "Harvard Health describes co-regulation as the process of connecting with a child in distress and noticing what that child needs in the moment to help them calm. It also points out one of the hardest parts for adults: we have to notice and manage our own emotions first so we can help the child manage theirs.",
    ),
  ),
  source(
    "Harvard Health: Co-regulation: Helping children and teens navigate big emotions",
    HARVARD_COREG,
  ),
  p(txt("That is one reason short scripts help parents too. You do not have to invent the perfect response while your own body is stressed. You just need one steady sentence.")),
  p(txt("One calm sentence is often better than ten perfect explanations your child cannot hear yet.")),

  h2("What not to say during the worst part"),
  p(txt("Most of these come from good intentions. I have said some of them myself. But in the middle of a complete sobbing meltdown, I would try to avoid:")),
  ul(
    "“Calm down.”",
    "“You’re fine.”",
    "“Stop crying.”",
    "“Use your words.”",
    "“This is not a big deal.”",
    "“You are being dramatic.”",
    "“Look at me.”",
    "“Why are you acting like this?”",
  ),
  p(txt("The problem is not that every one of those sentences is always wrong. The problem is timing.")),
  p(txt("When a child is fully flooded, those words can feel like pressure, shame, or another demand.")),
  p(txt("Later, “use your words” may be a skill you teach. In the middle of the sobbing, it is usually too much.")),

  h2("What to say instead"),
  p(txt("Here are a few simple scripts that work better in the moment.")),
  p(strong("If they are crying and cannot talk:")),
  quote("You do not have to talk yet. I’ll stay nearby."),
  p(strong("If they are panicking or repeating the same thing:")),
  quote("I hear you. We are going to slow this down one step at a time."),
  p(strong("If they are pushing you away but still need you close:")),
  quote("I’ll give you space, and I’m still here."),
  p(strong("If they are escalating because you set a boundary:")),
  quote("I know this is really hard. The answer is still no, and I will help you through it."),
  p(strong("If they are crying after doing something unsafe:")),
  quote("I love you. I will not let anyone get hurt. We can talk when your body is calm."),
  p(txt("That last one matters. Calm does not mean permissive. Connection does not mean there are no limits. It means you know which moment you are in.")),

  h2("The goal is not to stop the crying immediately"),
  p(txt("This is the part that can feel hard. Sometimes we treat crying like the problem. But crying is often the release.")),
  p(
    txt(
      "The goal is not always to make it stop as fast as possible. The goal is to help your child move through it safely without adding shame, fear, or more intensity.",
    ),
  ),
  p(
    txt(
      "Harvard’s Center on the Developing Child describes responsive back-and-forth interactions between children and caring adults as important for healthy development. Even a cry followed by a calm adult response is part of that pattern of responsiveness.",
    ),
  ),
  source("Harvard Center on the Developing Child: Serve and return", HARVARD_SERVE),
  p(txt("That does not mean you have to respond perfectly. It means your steady presence matters. Even when it feels like nothing is working.")),

  h2("What to do with your body"),
  p(txt("Your words matter, but your body is part of the message too. Try to:")),
  ul(
    "Lower your voice.",
    "Slow your breathing.",
    "Unclench your jaw.",
    "Sit nearby instead of standing over them.",
    "Keep your face calm.",
    "Give space if they need space.",
    "Stay close if they want closeness.",
    "Do not force eye contact.",
    "Do not demand a full explanation yet.",
  ),
  p(txt("Your child is not only listening to your words. They are reading your nervous system. And in a meltdown, your calm may be the thing they borrow until they can find their own.")),

  h2("When the meltdown includes unsafe behavior"),
  p(
    txt(
      "A sobbing meltdown can still need a firm boundary. If your child is hitting, kicking, throwing objects, head-banging, or hurting someone, safety comes first. You can still keep your words short.",
    ),
  ),
  p(txt("Try:")),
  ul(
    "“I will not let you hit.”",
    "“I’m moving this to keep everyone safe.”",
    "“I’m going to stay close, and I will block you from hurting your body.”",
    "“I love you too much to let you hurt yourself or anyone else.”",
  ),
  p(txt("This is not the time for a lecture. It is the time for calm, boring safety. Move objects. Create space. Separate children if needed. Lower stimulation. Use as few words as possible. Then talk later.")),

  h2("What to say after the meltdown"),
  p(txt("After your child is calm, you can teach. Not immediately after the last tear. Actually calm.")),
  p(txt("That may be 10 minutes later. It may be at bedtime. It may be the next morning, depending on the child and the situation.")),
  p(txt("You can say:")),
  ul(
    "“That was really hard earlier.”",
    "“You had a big feeling, and your body got overwhelmed.”",
    "“Next time, I’ll help you find words before it gets that big.”",
  ),
  p(txt("Or, if there was unsafe behavior:")),
  quote("You were really upset, and we still have to keep everyone safe."),
  p(txt("Then keep it short. A long post-meltdown review can restart the whole thing. The goal is not to make them feel bad enough to change. The goal is to help them understand what happened and what to try next time.")),

  h2("A simple three-step meltdown plan"),
  p(txt("When your child is in a complete sobbing meltdown, try this order.")),
  step("1. Settle", "I’m here. You are safe. We can slow this down together."),
  step("2. Stay", "You do not have to talk yet. I’ll stay nearby."),
  step("3. Teach later", "That was really hard. Next time, I’ll help you find words sooner."),
  p(txt("That is it. Not because parenting is easy. Because in the hardest moments, simple is what you can actually use.")),

  h2("Related Phrasewell guides"),
  p(txt("If this moment sounds familiar, you may also want scripts for:")),
  ul(
    "Saying “I hate you” or “You are not my real mom”",
    "Shutdown and refusing to speak",
    "Self-harm threats or head-banging",
    "Running away or hiding in the house",
    "Getting out of bed repeatedly",
  ),
  p(
    txt(
      "These are all part of the bigger “Big feelings and meltdowns” pattern that many parents see during high-stress moments.",
    ),
  ),

  h2("Frequently asked questions"),
  faq(
    "Should I ignore a sobbing meltdown?",
    [
      txt(
        "Not usually. There is a difference between not feeding a power struggle and leaving a child alone with more distress than they can handle. If the child is safe and just needs space, you can give space. But I would still stay emotionally available.",
      ),
    ],
    [strong("Try:"), txt(" “I’ll give you space. I’m right here when you’re ready.”")],
  ),
  faq(
    "What if my child screams louder when I talk?",
    [txt("Use fewer words. Some kids experience talking as more input when they are overloaded. Try one sentence, then stop.")],
    [strong("“I’m here. You are safe.”"), txt(" Then sit nearby quietly.")],
  ),
  faq(
    "What if they say they do not want me?",
    [
      txt(
        "Believe the feeling, not the permanence. You can say: “Okay. I’ll give you space. I’m still nearby.” That respects their need for space without abandoning them emotionally.",
      ),
    ],
  ),
  faq(
    "What if the meltdown started because I said no?",
    [
      txt(
        "You can hold the boundary and still offer calm. Try: “I know this is really hard. The answer is still no, and I will help you through it.” You do not have to choose between being kind and being firm.",
      ),
    ],
  ),
  faq(
    "When should I worry about meltdowns?",
    [
      txt(
        "If meltdowns are very frequent, unsafe, unusually long, or happening well beyond the age you would expect, it may be worth talking with a pediatrician, therapist, or qualified child development professional.",
      ),
    ],
    [
      txt(
        "The Child Mind Institute notes that frequent outbursts beyond early childhood can sometimes be connected to anxiety, ADHD, learning disorders, autism, or sensory processing struggles.",
      ),
    ],
    [link("Child Mind Institute: Why do kids have tantrums and meltdowns?", CMI)],
  ),

  h2("The words you need most are usually the simplest"),
  p(
    txt(
      "A complete sobbing meltdown can make you feel like you need the perfect parenting answer right now. Most of the time, you do not. You need one steady sentence.",
    ),
  ),
  quote("I’m here. You are safe. We can slow this down together."),
  p(txt("That may not stop the crying right away. But it gives your child something calm to come back to. And sometimes, that is the whole job in the moment.")),
  p(
    txt(
      "Phrasewell was built for moments like this. Not to replace your judgment. Not to act like therapy. Not to tell you who your child is. Just to give you calm, usable words when the moment is already hard.",
    ),
  ),
];
