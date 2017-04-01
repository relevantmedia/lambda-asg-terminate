var AWS = require('aws-sdk')
var ecs = new AWS.ECS()

module.exports = { listContainerInstances, describeContainerInstances }

function listContainerInstances(clusterName, cb) {
  // Set params for list Container instances
  var params = {
    cluster:clusterName
  }
  // Get list of container instance IDs from the clusterName
  ecs.listContainerInstances(params, function(err, data){
    if (err) console.log(err, err.stack); // an error occurred
    else {
      cb(null, data['containerInstanceArns'])
    }
  })
}

function describeContainerInstances(ec2Instance, instanceArns){
  var params = {
    cluster:ec2Instance.clusterName,
    containerInstances:instanceArns
  }
  ecs.describeContainerInstances(params, function(err, data){
    if (err) console.log(err, err.stack); // an error occurred
    else {
      console.log('desc container instances res', data)
      for (contInst in data['containerInstances']){
        var containerInstance = data['containerInstances'][contInst]

        console.log(
          "Container Instance ARN: %s and ec2 Instance ID %s",
          containerInstance['containerInstanceArn'],
          containerInstance['ec2InstanceId'])

        if (containerInstance['ec2InstanceId'] == ec2Instance.instanceId){
          console.log("Container Instance info", data['containerInstances'][contInst])
          checkContainerStatus(containerInstance, ec2Instance)
        }
      }
    }
  })
}

function checkContainerStatus(containerInstance, ec2Instance){
  console.log("Container instance ID of interest : %s",containerInstance['containerInstanceArn'])
  var containerInstanceId = containerInstance['containerInstanceArn']
 //  # Check if the instance state is set to DRAINING. If not, set it, so the ECS Cluster will handle de-registering instance, draining tasks and draining them
  var containerStatus = containerInstance['status']
  if (containerStatus == 'DRAINING'){
    console.log(
      "Container ID %s with EC2 instance-id %s is draining tasks",
      containerInstanceId,
      containerInstance['ec2InstanceId']
    )
    //re run lambda function publish sns topic
    var tmpMsgAppend = {"containerInstanceId": containerInstanceId}
  }
  else {
   //  # Make ECS API call to set the container status to DRAINING
    console.log("Make ECS API call to set the container status to DRAINING...")
    //updateConatinerInstanceState(ec2Instance, containerInstanceId)

  }
  // # Using container Instance ID, get the task list, and task running on that instance.
  if containerInstanceId != None:
      # List tasks on the container instance ID, to get task Arns
      listTaskResp = ecsClient.list_tasks(cluster=clusterName, containerInstance=containerInstanceId)
      logger.debug("Container instance task list %s",listTaskResp['taskArns'])

      # If the chosen instance has tasks
      if len(listTaskResp['taskArns']) > 0:
          logger.info("Tasks are on this instance...%s",Ec2InstanceId)
          return 1, tmpMsgAppend
      else:
          logger.info("NO tasks are on this instance...%s",Ec2InstanceId)
          return 0, tmpMsgAppend
  else:
      logger.info("NO tasks are on this instance....%s",Ec2InstanceId)
      return 0, tmpMsgAppend

}

function updateConatinerInstanceState(ec2Instance, containerId){
  var params = {
    cluster:ec2Instance.clusterName,
    containerInstances:containerId,
    status:'DRAINING'
  }
  ecs.updateConatinerInstanceState(params, function(err, data){
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
    //  # When you set instance state to draining, append the containerInstanceID to the message as well
    tmpMsgAppend = {"containerInstanceId": containerInstanceId}
  })
}
