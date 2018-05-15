namespace :travis do
  desc "Parse application.yml and ecrypt .travis.yml"
  task :set_env do
    Figaro.application.environment = "production"
    env_str = Figaro.application.configuration.map { |key, value| "#{key}=#{value}" }.join(" ")
    exec "travis encrypt #{env_str} --add"
  end
end