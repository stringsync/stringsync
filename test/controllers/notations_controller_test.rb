require 'test_helper'

class NotationsControllerTest < ActionDispatch::IntegrationTest
  test "#index" do
    get(notations_path)
    assert_response(200)
  end

  test "#show" do
    get(notation_path(1))
    assert_response(200)
  end

  test "#create disallows non logged in users to create a notation" do
    post(notations_path)
    assert_response(401)
  end

  test "#create allows teacher and admin users to create a notation" do
    users(:teacher1, :admin1).each do |user|
      assert(user.has_role?(:teacher))
      count = Notation.count

      params = {
        notation: {
          tag_ids: tags(:acoustic),
          song_name: "foo",
          artist_name: user.name,
          vextab_string: "tabstave clef=none notation=true key=C time=4/4",
          thumbnail: fixture_file_upload(file_fixture("notation_thumbnail_1.jpg"), "image/jpg"),
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
          slice(*%i(song_name artist_name vextab_string)).
          each { |name, value| assert_equal(value, notation.send(name)) }

      params[:notation][:video_attributes].each do |name, value|
        assert_equal(value, notation.video.send(name))
      end

      assert_equal(user, notation.transcriber)
    end
  end

  test "#update allows its own transcriber to update a notation" do
    id = :notation2
    notation = notations(id)
    transcriber = notation.transcriber
    count = Notation.count

    refute(
      transcriber.has_role?(:admin),
      "Expected a notation fixture (#{id}) whose transcriber does not have the admin role"
    )

    song_name = "This Will Never Coincidentally be the Fixture's Name"
    params = { notation: { song_name: song_name } }
    tokens = sign_in_as(transcriber, "stringsync")
    patch(notation_path(notation), headers: tokens, params: params)
    assert_response(200)
    assert_equal(count, Notation.count)

    notation.reload
    assert_equal(song_name, notation.song_name)
    assert_equal(transcriber.id, notation.transcriber_id)
  end

  test "#update disallows a different teacher and students to update a notation" do
    users(:student1, :teacher2).each do |user|
      id = :notation2
      notation = notations(id)
      count = Notation.count

      refute(
        user.has_role?(:admin),
        "Expected a notation fixture (#{id}) whose user does not have the admin role"
      )

      refute_equal(user, notation.transcriber)

      tokens = sign_in_as(user, "stringsync")
      patch(notation_path(notation), headers: tokens)
      assert_response(401)

      attributes = notation.attributes
      notation.reload
      assert_equal(count, Notation.count)
      assert_equal(attributes, notation.attributes)
    end
  end

  test "#update allows an admin to update any notation" do
    id = :notation2
    notation = notations(id)
    user = users(:admin1)
    count = Notation.count

    assert(user.has_role?(:admin))
    refute_equal(user, notation.transcriber)

    song_name = "This Will Never Coincidentally be the Fixture's Name"
    params = { notation: { song_name: song_name } }
    tokens = sign_in_as(user, "stringsync")
    patch(notation_path(notation), headers: tokens, params: params)
    assert_response(200)
    assert_equal(count, Notation.count)

    transcriber_id = notation.transcriber_id
    notation.reload
    assert_equal(song_name, notation.song_name)
    assert_equal(transcriber_id, notation.transcriber_id)
  end

  test "#destroy disallows students or teachers" do
    users(:student1, :teacher1).each do |user|
      id = :notation2
      notation = notations(id)
      count = Notation.count

      refute(
        user.has_role?(:admin),
        "Expected a notation fixture (#{id}) whose user does not have the admin role"
      )

      tokens = sign_in_as(user, "stringsync")
      delete(notation_path(notation), headers: tokens)
      assert_response(401)

      attributes = notation.attributes
      notation.reload
      assert_equal(count, Notation.count)
      assert_equal(attributes, notation.attributes)
    end
  end

  test "#destroy allows admins" do
    id = :notation2
    notation = notations(id)
    count = Notation.count
    user = users(:admin1)

    assert(
      user.has_role?(:admin),
      "Expected a notation fixture (#{id}) whose user has the admin role"
    )

    tokens = sign_in_as(user, "stringsync")
    delete(notation_path(notation), headers: tokens)
    assert_response(200)

    assert_equal(count - 1, Notation.count)
    refute(Notation.where(id: notation.id).exists?)
  end
end
