namespace :start do
  task development: :environment do
    run_storybook = ENV["WITH_STORYBOOK"] == "true"
    exec "foreman start -f Procfile.dev web=1,api=1,sb=#{run_storybook ? 1 : 0}"
  end

  desc "Start production server"
  task :production do
    exec "NPM_CONFIG_PRODUCTION=true npm run postinstall && foreman start"
  end
end

desc "Start development server"
task :start => "start:development"
