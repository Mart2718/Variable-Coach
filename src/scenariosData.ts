import { Scenario } from "./types";

export const presetScenarios: Scenario[] = [
  {
    id: "coffee-shop-experiment",
    title: "The Coffee Bean Recall Study",
    category: "coffee",
    description: "A researcher sets up an experiment in 'Spill the Beans' coffee house. She serves customers different exact doses of espresso concentration and then tests their memory recall accuracy. She wants to see if consuming higher caffeine doses leads to changes in cognitive score performance.",
    researchQuestion: "Does the number of espresso shots in a drink explain the variation in a customer's subsequent memory recall score (0-100%)?",
    variables: [
      {
        name: "Espresso Shots Added",
        description: "The absolute number of concentrated organic espresso shots added to the beverage.",
        exampleData: ["1 Shot", "2 Shots", "3 Shots", "4 Shots"],
        type: "Quantitative",
        typeReasoning: "It represents a countable numerical quantity where the numbers hold mathematical value. You can add them, rank them, or speak of double the quantity of coffee.",
        mathTest: {
          question: "Can we calculate a meaningful average of these values?",
          items: ["1 shot", "2 shots", "3 shots", "4 shots"],
          explanation: "Yes! If Customer A drinks 1 shot and Customer B drinks 3 shots, the average is exactly 2 shots. This average represents a real mid-point.",
          mathExplanation: "(1 + 2 + 3 + 4) / 4 = 2.5 shots. This number makes absolute arithmetic sense!",
          averageAllowed: true
        },
        visualAnalogy: {
          title: "The Measuring Cup",
          analogyText: "Imagine a measuring glass marked from 0 to 5. You can pour coffee right up to a line. 'Espresso Shots Added' behaves like a physical height on a ruler or liquid in a cup—it has magnitude, increments, and a true starting point at zero.",
          type: "ruler",
          concept: "Interval & Magnitude"
        }
      },
      {
        name: "Memory Recall Score",
        description: "The percentage of correct items retrieved during a standard cognitive response quiz post-beverage (0% to 100%).",
        exampleData: ["55%", "75%", "90%", "95%"],
        type: "Quantitative",
        typeReasoning: "This contains real numerical figures representing grades. A score of 90 is twice as accurate as a score of 45.",
        mathTest: {
          question: "Can we calculate a meaningful average of these values?",
          items: ["55%", "75%", "90%"],
          explanation: "Yes, definitely! The average memory score of these three subjects is 73.3%. This is a valid numeric metric describing general performance.",
          mathExplanation: "(55 + 75 + 90) / 3 = 73.3%. The arithmetic average accurately reports the mid-point performance.",
          averageAllowed: true
        },
        visualAnalogy: {
          title: "The Target Board Score",
          analogyText: "Picture a dartboard where closer arrows yield more points. Adding up score points and dividing is standard practice; you are marking final metrics along a range of achievements.",
          type: "scale",
          concept: "Continuous Score Magnitude"
        }
      }
    ],
    explanatoryIndex: 0,
    responseIndex: 1,
    driverExplanation: "The number of espresso shots is the independent trigger (the 'driver') that the researcher physically changes to see if it causes a shift.",
    outcomeExplanation: "The memory recall score is the outcome (the 'response') that we observe to see if it changes under different caffeine conditions."
  },
  {
    id: "gym-strength-study",
    title: "Muscle Recovery & Hydration Type",
    category: "gym",
    description: "At 'Peak Performance Gym', fitness directors track how different hydration drinks affect a lifter's muscle fatigue score at the end of a grueling powerlifting session. They assign volunteers to either Electrolyte Mix, Fruit Smoothie, or plain Tap Water.",
    researchQuestion: "Does the category of Hydration Drink consumed explain the variation in the Lifter Fatigue Rating (scale 1 to 10)?",
    variables: [
      {
        name: "Hydration Drink Group",
        description: "The specific formula category given to the lifter's water bottle.",
        exampleData: ["Electrolyte Mix", "Fruit Smoothie", "Plain Tap Water"],
        type: "Categorical",
        typeReasoning: "This refers to named groups of drink styles. Even if you coded them as Group 1, Group 2, Group 3, the numbers are just codes for words—they hold no actual mathematical value.",
        mathTest: {
          question: "Can we calculate a meaningful average of these values?",
          items: ["Tap Water", "Electrolyte Mix", "Smoothie"],
          explanation: "No. You cannot calculate the physical average of a smoothie and tap water. You can't divide a flavor profile or add water to electrolyte powder to get some 'average drink' in a math formula.",
          mathExplanation: "Tap Water + Smoothie = Unable to compute numerical mean.",
          averageAllowed: false
        },
        visualAnalogy: {
          title: "The Dynamic Sorting Bins",
          analogyText: "Think of three separate lockers. Locker A contains lifters sipping smoothies, Locker B contains electrolyte mixes, and Locker C contains tap water. There is no continuous path from Tap water to Smoothie—they are separate cubbies.",
          type: "buckets",
          concept: "Discrete Categories"
        }
      },
      {
        name: "Fatigue Score",
        description: "A subjective rating from 1 to 10 measuring muscle exhaustion.",
        exampleData: ["1 (Energetic)", "5 (Tired)", "10 (Exhausted)"],
        type: "Quantitative",
        typeReasoning: "Though fatigue is reported on a scale (which can sometimes be treated as ordinal), here it acts as a numerical rating that estimates level of exhaustion, allowing calculations like recovery percentages and group means.",
        mathTest: {
          question: "Can we calculate a meaningful average of these values?",
          items: ["Score: 3", "Score: 7", "Score: 8"],
          explanation: "Yes! If Lifter A reports a fatigue level of 3 and Lifter B reports an 8, their group average fatigue rating is 5.5, which tells us they are moderately fatigued.",
          mathExplanation: "(3 + 8) / 2 = 5.5. A higher average rating indicates a higher general state of exhaustion.",
          averageAllowed: true
        },
        visualAnalogy: {
          title: "The Exhaustion Thermometer",
          analogyText: "Imagine a scale from cold to boiling hot. The higher the index, the more heat we have. A score of 8 contains physically more fatigue than a score of 4; we can plot it directly as a height on a thermometer gauge.",
          type: "scale",
          concept: "Scale Magnitude"
        }
      }
    ],
    explanatoryIndex: 0,
    responseIndex: 1,
    driverExplanation: "The Hydration Drink is the input or 'Independent' variable (Explanatory) that is assigned to see if it causes a difference in exhaustion.",
    outcomeExplanation: "The Fatigue Score is the final visual feedback or 'Dependent' variable (Response) that shows the result of the drinking habits."
  },
  {
    id: "school-attendance-study",
    title: "Study Intensity & Exam Outcomes",
    category: "school",
    description: "A high school counselor tracks students who are prepping for an advanced calculus exam. She measures how many total hours they spend studying during the pre-exam week, and then records whether they passed the exam (Pass vs. Fail).",
    researchQuestion: "Does the number of preparation hours explain whether a student passes or fails the exam?",
    variables: [
      {
        name: "Preparation Time",
        description: "The total number of hours a student studied relative to their normal schedule.",
        exampleData: ["4 Hours", "12 Hours", "18 Hours", "25 Hours"],
        type: "Quantitative",
        typeReasoning: "Hours are continuous numerical quantities. You can double them, find intermediate values, and run calculation analyses directly on prep times.",
        mathTest: {
          question: "Can we calculate a meaningful average of these values?",
          items: ["4 hrs", "12 hrs", "18 hrs"],
          explanation: "Yes! If three students put in these durations, their average study prep time is 11.3 hours. It is completely logical to study for eleven hours and twenty minutes.",
          mathExplanation: "(4 + 12 + 18) / 3 = 11.33 hours. A perfect continuous numeric calculation.",
          averageAllowed: true
        },
        visualAnalogy: {
          title: "The Hourglass Flow",
          analogyText: "Imagine sand falling through a classic hourglass. The sand accumulates incrementally in the bottom bulb. It represents a continuous volume where more grains of sand means more physical time spent.",
          type: "ruler",
          concept: "Continuous Time Volumetrics"
        }
      },
      {
        name: "Exam Result Status",
        description: "The final binary pass/fail grading assessment recorded on a student's database card.",
        exampleData: ["Passed Exam", "Failed Exam"],
        type: "Categorical",
        typeReasoning: "These are qualitative labels with absolutely no numeric values. You cannot perform operations like addition or subtraction directly on the word 'Passed'.",
        mathTest: {
          question: "Can we calculate a meaningful average of these values?",
          items: ["Passed", "Passed", "Failed"],
          explanation: "No! What is the math average of 'Passed' and 'Failed'? You cannot add them up to find some 'semi-passed' arithmetic level. You can calculate the *percentage* of students who passed, but the variable itself is still a words-based category, not a number.",
          mathExplanation: "Passed + Failed / 2 = Syntax Error! Word labels cannot be summed.",
          averageAllowed: false
        },
        visualAnalogy: {
          title: "The Gatekeeper's Folders",
          analogyText: "Picture a secure school cabinet with two labeled slots: 'Folder A: Passed' and 'Folder B: Failed'. Cards are dropped into one of these two slots. There is no intermediate folder. These are distinct bins, which defines a Categorical variable.",
          type: "buckets",
          concept: "Discrete File Dividers"
        }
      }
    ],
    explanatoryIndex: 0,
    responseIndex: 1,
    driverExplanation: "The total time spent preparing (Preparation Time) is the cause or 'driver' (Explanatory) that a student invests beforehand.",
    outcomeExplanation: "The final Pass/Fail Result Status is the final effect or 'outcome' (Response) that we observe at the end of the timeline."
  }
];
