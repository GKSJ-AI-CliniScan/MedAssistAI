import { useState } from "react";
import Layout from "../../components/layout/Layout";

function Profile() {
const [image, setImage] = useState(
  localStorage.getItem("profileImage") || null
);
const [editing, setEditing] = useState(false);

const [profile, setProfile] = useState(() => {
  const savedProfile = localStorage.getItem("profile");

  return savedProfile
    ? JSON.parse(savedProfile)
    : {
        name: "SHAIK DAIMEL BASITH",
        age: "20",
        gender: "Male",
        height: "168 cm",
        weight: "59 kg",
      };
});

const handleImageChange = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    setImage(reader.result);

    localStorage.setItem(
      "profileImage",
      reader.result
    );
  };

  reader.readAsDataURL(file);
};

  return (
    <Layout>
      <div className="max-w-4xl bg-white rounded-3xl shadow-xl p-10">

        <div className="flex flex-col items-center">

          <div className="relative">

  <img
    src={
      image ||
      "https://ui-avatars.com/api/?name=Patient&background=2563eb&color=fff"
    }
    alt="Profile"
    className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
  />

  <label
    htmlFor="profileImage"
    className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer"
  >
    📷
  </label>

  <input
    id="profileImage"
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />

</div>

          <h1 className="text-3xl font-bold">
            {profile.name}
          </h1>

          <p className="text-gray-500 mb-8">
            Patient
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="font-semibold">Age</label>
            <input
              onChange={(e) =>
                setProfile({ ...profile, age: e.target.value })
              }
              value={profile.age}
              readOnly={!editing}
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="font-semibold">Gender</label>
            <input
              value={profile.gender}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  gender: e.target.value,
                })
              }
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="font-semibold">Height</label>
            <input
              value={profile.height}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  height: e.target.value,
                })
              }
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="font-semibold">Weight</label>
            <input
              value={profile.weight}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  weight: e.target.value,
                })
              }
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>

        </div>

        <button
          onClick={() => {
            if (editing) {
              localStorage.setItem(
                "profile",
                JSON.stringify(profile)
              );

              alert("Profile Updated Successfully ✅");
            }

            setEditing(!editing);
          }}
          className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700"
        >
          {editing ? "Save Profile" : "Edit Profile"}
        </button>

      </div>
    </Layout>
  );
}

export default Profile;