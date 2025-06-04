import { NextResponse } from 'next/server';
import connectDB from '@/lib/connectDb';
import QuestionModel from '@/lib/question.model';
import UserModel from '@/lib/user.model';

// Connect to database
await connectDB();

// Initial seed data
const seedData = [
  {
    title: "How to prepare for technical interviews?",
    content: "I'm a third-year student looking for internship opportunities. What's the best way to prepare for technical interviews at top companies?",
    author: {
      name: "Alex Johnson",
      avatar: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg",
      userId: "seed_user_1",
      year: "3rd Year"
    },
    tags: ["career", "technical", "preparation"],
    answers: [
      {
        content: "Focus on data structures and algorithms. Practice on LeetCode and HackerRank regularly. Also, work on real-world projects to build your portfolio.",
        author: {
          name: "Sarah Chen",
          avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
          userId: "seed_user_2",
          year: "Alumni"
        },
        votes: 15,
        votedBy: [],
        isAccepted: true
      }
    ],
    solved: true
  },
  {
    title: "Career switch to AI/ML",
    content: "I'm currently working in web development but interested in transitioning to AI/ML. What should be my learning roadmap?",
    author: {
      name: "Emily Zhang",
      avatar: "https://images.pexels.com/photos/1987301/pexels-photo-1987301.jpeg",
      userId: "seed_user_3",
      year: "4th Year"
    },
    tags: ["career", "technical", "academics"],
    answers: [
      {
        content: "Start with Python and mathematics fundamentals (linear algebra, calculus, statistics). Then move on to ML libraries like scikit-learn and TensorFlow.",
        author: {
          name: "David Kumar",
          avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
          userId: "seed_user_4",
          year: "Alumni"
        },
        votes: 8,
        votedBy: []
      }
    ]
  }
];

// Helper function to seed initial data
// async function seedDatabase() {
//   try {
//     const count = await QuestionModel.countDocuments();
//     if (count === 0) {
//       await QuestionModel.insertMany(seedData);
//       console.log('Database seeded successfully');
//     }
//   } catch (error) {
//     console.error('Error seeding database:', error);
//   }
// }

// // Seed the database when the module loads
// seedDatabase();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const tag = searchParams.get('tag');
    
    let query = {};
    if (tag) {
      query.tags = tag;
    }

    const questions = await QuestionModel.find(query).sort({ createdAt: -1 });
    const dbuser=await UserModel.findOne({ clerkId: userId });
    
    if (userId) {
      const enhancedQuestions = questions.map(question => {
        const enhancedAnswers = question.answers.map(answer => ({
          ...answer.toObject(),
          hasVoted: answer.votedBy.includes(userId)
        }));
        
        return {
          ...question.toObject(),
          answers: enhancedAnswers
        };
      });
      
      return NextResponse.json({enhancedQuestions,dbuser});
    }

    return NextResponse.json({questions,dbuser});
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Failed to fetch questions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newQuestion = await QuestionModel.create(body);
    
    // Award points for asking a question
    const user = await UserModel.findOne({ clerkId: body.author.userId });
    if (user) {
      user.points += 5; // 5 points for asking a question
      await user.save();
    }
    
    return NextResponse.json(newQuestion);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Failed to create question' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { question_id, answer, action, user_id, answer_id } = await request.json();
    const question = await QuestionModel.findById(question_id);

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    if (action === 'answer') {
      question.answers.push(answer);
      // Award points for answering
      const user = await UserModel.findOne({ clerkId: answer.author.userId });
      if (user) {
        user.points += 10; // 10 points for providing an answer
        await user.save();
      }
    } 
    else if (action === 'vote') {
      const answerIndex = question.answers.findIndex(a => a._id.toString() === answer_id);
      if (answerIndex !== -1) {
        const answer = question.answers[answerIndex];
        if (!answer.votedBy.includes(user_id)) {
          answer.votes += 1;
          answer.votedBy.push(user_id);
          
          // Award points for receiving an upvote
          const answerer = await UserModel.findOne({ clerkId: answer.author.userId });
          if (answerer) {
            answerer.points += 2; // 2 points for receiving an upvote
            await answerer.save();
          }
        }
      }
    }
    else if (action === 'accept') {
      const answerIndex = question.answers.findIndex(a => a._id.toString() === answer_id);
      if (answerIndex !== -1) {
        question.answers.forEach(a => a.isAccepted = false);
        question.answers[answerIndex].isAccepted = true;
        question.solved = true;
        
        // Award points for accepted answer
        const answerer = await UserModel.findOne({ clerkId: question.answers[answerIndex].author.userId });
        if (answerer) {
          answerer.points += 15; // 15 points for having answer accepted
          await answerer.save();
        }
      }
    }

    await question.save();
    return NextResponse.json(question);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Failed to update question' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get('id');
    const userId = searchParams.get('user_id');

    const question = await QuestionModel.findById(questionId);

    if (!question) {
      return NextResponse.json({ message: 'Question not found' }, { status: 404 });
    }

    if (question.author.userId !== userId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
    }

    await QuestionModel.findByIdAndDelete(questionId);
    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Failed to delete question' }, { status: 500 });
  }
}