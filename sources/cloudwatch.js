var AWS = require('aws-sdk')
var ec2 = require('../services/ec2')
var ecs = require('../services/ecs')

exports.parseEvent = function(cwEvent, context, cb) {
  // var Ec2InstanceId = cwEvent.detail.EC2InstanceId
  var asgGroupName = cwEvent.detail.AutoScalingGroupName
  var ec2Instance
  var params

  // var ecs = new AWS.ECS()
  ec2.describeInstance(cwEvent, function(err, data){
    ec2Instance = data
    if (ec2Instance.clusterName){
      ecs.listContainerInstances(ec2Instance.clusterName, function(err, data){
        var containerInstances = data
        ecs.describeContainerInstances(ec2Instance, containerInstances)

      })

    }

    // cb(ec2Instance)

  })

}
