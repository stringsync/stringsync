namespace :deploy_heroku do
  desc "Push master to heroku"
  task :push_master do
    exec "git push heroku master"
  end

  desc "Inject config stored in ENV variables by figaro"
  task :inject_config do
    exec "figaro heroku:set -e production"
  end
end

desc "Deploy to Heroku"
task :deploy_heroku => "push_master:inject_config"
