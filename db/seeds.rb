return unless Rails.env.development?

require File.join(Rails.root, "lib", "fixture_loader", "fixture_loader.rb")

ApplicationRecord.descendants.each(&:delete_all)
FixtureLoader.new.seed!
