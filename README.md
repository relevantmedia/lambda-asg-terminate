# lambda-asgtermination
check if instance being terminated has any running containers

Setup
for local dev create a .npmrc file with the following parameters
s3_bucket
s3_bucket_url
lambda_function

Auto Scaling Group function
- create a cloudwatch event to trigger lambda function to run
- add lifecycle-hook to Auto Scaling Group
http://docs.aws.amazon.com/autoscaling/latest/userguide/lifecycle-hooks.html#adding-lifecycle-hooks
-- aws autoscaling put-lifecycle-hook --lifecycle-hook-name my-hook --auto-scaling-group-name my-asg
add --lifecycle-transition autoscaling:EC2_INSTANCE_LAUNCHING
or --lifecycle-transition autoscaling:EC2_INSTANCE_TERMINATING
