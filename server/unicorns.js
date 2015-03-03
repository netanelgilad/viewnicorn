/**
 * Created by netanel on 03/03/15.
 */

Unicorns.allow({
  insert : function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove : function() {
    return true;
  }
});

Meteor.publish('unicorns', function() {
  return Unicorns.find({});
});