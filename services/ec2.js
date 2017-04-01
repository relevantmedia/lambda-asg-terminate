var AWS = require('aws-sdk')
var ec2 = new AWS.EC2()

module.exports = {
  describeInstance
}

function describeInstance(cwEvent, cb){
  var Ec2InstanceId = cwEvent.detail.EC2InstanceId
  var params = {
    InstanceId:Ec2InstanceId,
    Attribute:'userData'
  }

  ec2.describeInstanceAttribute(params, function(err, data){
    if (err) console.log(err, err.stack) // an error occurred
    else {
      var userdataEncoded = data.UserData
      var userdataDecoded = new Buffer(userdataEncoded['Value'], 'base64').toString('ascii')
      var tmpList = userdataDecoded.split("\n")

      for (i in tmpList) {
        if ( tmpList[i].search("ECS_CLUSTER_NAME=") > -1 ){
            // Split and get the cluster name
            cb(null, {
              clusterName:tmpList[i].split('=')[1],
              instanceId:Ec2InstanceId
            })
        }
      }
    }
  })
}
