require File.join(Rails.root, "lib", "fixture_loader", "fixture_loader.rb")

FixtureLoader.new.seed! if Rails.env.development?
