exports.getDate = function() {
   // Create a new Date object
   const now = new Date();

   // Convert to UTC and format as an ISO string
   const isoString = now.toISOString();

   // Return the ISO string
   return isoString;
};