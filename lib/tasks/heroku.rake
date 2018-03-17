namespace :heroku do
  desc "Push master to heroku"
  task :push do
    exec "git push heroku #{ENV.fetch("BRANCH", "master")}"
  end

  desc "Inject ENV variables by figaro"
  task :set_env do
    exec "figaro heroku:set -e production"
  end

  desc "Deploy to Heroku"
  task deploy: %i(push set_env)
end
