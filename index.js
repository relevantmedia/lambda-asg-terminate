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

  // CloudWatch currently has no setting to determine whether errors should be retried
  // By default they are, which we don't want, so always try to callback successfully
  // var done = utils.once(function cwDone(err, data) {
  //   cb(null, data)
  // })
  //
  // cw.parseEvent(cwEvent, function(err, buildData) {
  //   if (err) return done(err)
  //
  //   if (buildData.ignore) {``
  //     console.log(buildData.ignore)
  //     console.log('Not running build')
  //     return done()
  //   }
  //
  //   console.log('Build data', buildData)
  //
  //   actions.run(buildData, context, done)
  // })

}
