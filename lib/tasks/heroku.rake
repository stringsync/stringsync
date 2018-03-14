namespace :heroku do
  desc "Push master to heroku"
  task :push do
    exec "git push heroku #{ENV.fetch("BRANCH", "master")}"
  end

  desc "Inject config stored in ENV variables by figaro"
  task :inject_config do
    exec "figaro heroku:set -e production"
  end

  desc "Deploy to Heroku"
  task deploy: %i(push inject_config)
end
