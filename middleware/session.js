const mongoose = require('mongoose');
  async function invalidateUserSessions(userId) {
    console.log(userId);
    const db = mongoose.connection.db;
  
    // Assuming your sessions are stored in a collection named 'sessions'
    // This is typical for connect-mongo with the default settings
    const sessionsCollection = db.collection('sessions');
    const userIdToFind = userId.toString(); // Ensure userId is a string
  const cursor = sessionsCollection.find();
  
  const sessionsToDelete = [];
  
  while (await cursor.hasNext()) {
    const sessionDoc = await cursor.next();
    try {
      const sessionData = JSON.parse(sessionDoc.session);
      if (sessionData.userId === userIdToFind) {
        // If the session contains the userId we're looking for, add its ID to the list
        sessionsToDelete.push(sessionDoc._id);
      }
    } catch (error) {
      console.error("Error parsing session data:", error);
    }
  }
  
  // Now delete all sessions that matched the userId
  try{
    if (sessionsToDelete.length > 0) {
      const deleteResult = await sessionsCollection.deleteMany({
        _id: { $in: sessionsToDelete }
      });
      console.log(`Deleted ${deleteResult.deletedCount} sessions for user ID ${userIdToFind}`);
    } else {
      console.log("No sessions found for the specified user ID.");
    }
  }
  catch (err)
  {
    console.log("Error there but doesnt affect anything");
  }
  
  };
module.exports=invalidateUserSessions;