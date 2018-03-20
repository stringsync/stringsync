require 'test_helper'

class NotationsControllerTest < ActionDispatch::IntegrationTest
  test "NotationsController#index" do
    get(notations_path)
    assert_response(200)
  end

  test "NotationsController#show" do
    get(notations_path(1))
    assert_response(200)
  end

  test "NotationsController#create disallows non logged in users to create a notation" do
    post(notations_path)
    assert_response(401)
  end

  test "NotationsController#create allows teacher and admin users to create a notation" do
    users(:teacher1, :admin1).each do |user|
      assert(user.has_role?(:teacher))

      count = Notation.count

      params = {
        notation: {
          song_name: "foo",
          artist_name: user.name,
          vextab_string: "tabstave clef=none notation=true key=C time=4/4",
          thumbnail: fixture_file_upload(file_fixture("notation_thumbnail.jpg"), "image/jpg"),
          video_attributes: {
            kind: "youtube",
            src: "baz"
          }
        }
      }

      tokens = sign_in_as(user, "stringsync")
      post(notations_path, headers: tokens, params: params)
      assert_response(200)
      assert_equal(count + 1, Notation.count)

      notation = Notation.last
      
      params[:notation].
          slice(*%i(song_name artist_anme vextab_string)).
          each { |name, value| assert_equal(value, notation.send(name)) }

      params[:notation][:video_attributes].each do |name, value|
        assert_equal(value, notation.video.send(name))
      end

      assert_equal(user, notation.transcriber)
    end
  end

  test "NotationsController#update allows the transcriber to update a notation" do
    
  end
end
