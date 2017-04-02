var utils = require('./utils')
var cw = require('./sources/cloudwatch')

exports.lambdaHandler = function(event, context, cb) {
  // event should be CloudWatch
  console.log('Raw event', event)
  if (event.source && event.source == 'aws.autoscaling') {
    console.log('running cw parse function')
    return cwBuild(event, context, cb)
  }

  // log.error('Unknown event, ignoring:\n%j', event)
  return cb(new Error('Unknown event'))
}

function cwBuild(cwEvent, context, cb) {
  var done = utils.once(function cwDone(err, data) {
    cb(null, data)
  })

  cw.parseEvent(cwEvent, context, done)
}
