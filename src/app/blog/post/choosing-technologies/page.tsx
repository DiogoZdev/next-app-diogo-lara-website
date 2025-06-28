import { GradientHeader } from "@/components/GradientHeader";
import { Post } from "@/components/Post";

export default function ChoosingTechnologies() {
  return (
    <Post>
      <>
        <GradientHeader text="Choosing technologies to work with" />

        <p>
          I'll start telling you about an experience I had recently, but I need
          to give some context for that.
        </p>

        <p>
          Since I had my fist opportunity to work as a frontend developer, I've
          only worked with Angular framework for frontend development. Even
          though I started by learning ReactJS because I knew it had and it
          still has a bigger community, that was not an issue to adapt to new
          concepts and approaches.
        </p>

        <p>
          Well, that being said, I was updating my Linkedin profile as I use to
          do, (and dont wait till you need it to keep it updated, because it's a
          great tool) I received a message from a very nice recruiter. She asked
          me about my experiences and such, and then, an interisting question
          appeared: -Do you know ReactJS?-. I must admit that really got me
          thinking at the very moment. I knew the tool, I've built some projects
          with it, but I've never actually used it at work.
        </p>

        <p>
          I don't know if I answered the best I could, but I'm very satisfied
          with what came to me. - First things first, I believe being sincere is
          a must. I don't ever encourage anyone to lie to get hired or anything
          like that, because sooner or later the truth will prevail. - Back to
          the topic, I said I've used in some projects, but i've not used it at
          work. I could clearly make relations comparing Angular and React,
          because basically you can develop a full app working piece by piece
          with the idea of components, and basically I could translate something
          I use to do with Angular to a different approach in ReactJS.
        </p>

        <p>
          I dind't forget to mention that I know both tools are basically
          different ways to connect the logic and the UI. Some aspects may
          differ, but in general, knowing how to use JavaScript well meant it
          would not be a big deal using one or another.
        </p>

        <p>
          Then, what did I learn from that? I may sum my idea over something
          that has been said already by many more. One should not adopt a
          favorite library or framework, these tools are based in a common
          technology to achieve something similar, build web apps.
        </p>

        <p>What do I mean with all that?</p>
        <ul>
          <li className="list-disc">
            <p>Understand the logic before trying to solve a problem.</p>
          </li>

          <li className="list-disc">
            <p>Know your semantic HTML before building a soup of divs.</p>
          </li>

          <li className="list-disc">
            <p>Understand your CSS before jumping into Tailwind (That wouldn't even
            make any sense).</p>
          </li>

          <li className="list-disc">
            <p>Learn the principles of JavaScript before trying a cool frontend
            framework.</p>
          </li>
        </ul>
        <p>
          By this approach, it doesn't matter it they use a different technology
          you learned, you can follow the same basic principles everywhere and
          adapt to change with ease. Tools come and may go one day or another,
          basic principles are used in every language.
        </p>

        <p>
          I remember the first contact I had with Java I was already using
          Spring Boot. I wanted to be a frontend developer and had never used
          Java before. That was really challenging, and I got very frustrated at
          the time because I didn't even know how to make a simple Java app. I'm
          very thankful to those nice friends I had around helping me dealing
          with that. I needed to learn from the basics.
        </p>

        <p>
          Being sincere, It doesn't make sense wanting to start big. I know
          there are a million technologies today and sometimes we want to hold
          it all to not be left behind. I know the frustrating feelings.
          Conquering the basics will make the development journey much more
          possible, and most important, enjoyable.
        </p>

        <p>
          Just to wrap it up, I heard Angular has a steeper learning curve than
          other tools, but after understanding how to use it, learning the
          different details and specs of other tools was so much fast than
          starting again. Just a matter of days, I might say, in order to feel
          confortable doing the same thing.
        </p>

        <p>
          I'm not an expert on anything. If you want to correct me or just send
          a hello, send me a message.
        </p>
      </>
    </Post>
  );
}
