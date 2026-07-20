import { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";
import api from "../../services/api";

function Profile() {
  const token = localStorage.getItem("token");

  let imageKey = "profileImage";

  if (token) {
    const payload = JSON.parse(atob(token.split(".")[1]));
    imageKey = `profileImage_${payload.id || payload.sub}`;
  }

  const [image, setImage] = useState(null);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    blood_type: "",
    height: "",
    weight: "",
    allergies: [],
    medical_conditions: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile(response.data);

      const imageKey = `profileImage_${response.data.user_id}`;
      const savedImage = localStorage.getItem(imageKey);

      if (savedImage) {
        setImage(savedImage);
      } else {
        setImage(null);
      }
    } catch (error) {
      toast.error("Unable to load profile.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);

      const imageKey = `profileImage_${profile.user_id}`;

      localStorage.setItem(
        imageKey,
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
                `https://ui-avatars.com/api/?name=${profile.first_name || "Patient"
                }+${profile.last_name || ""}&background=2563eb&color=fff`
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
            {profile.first_name} {profile.last_name}
          </h1>

          <p className="text-gray-500 mb-8">
            Patient
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <label className="font-semibold">First Name</label>
            <input
              value={profile.first_name || ""}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  first_name: e.target.value,
                })
              }
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="font-semibold">Last Name</label>
            <input
              value={profile.last_name || ""}
              readOnly={!editing}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  last_name: e.target.value,
                })
              }
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>

          <div>
            <label className="font-semibold">Date of Birth</label>
            <input
              onChange={(e) =>
                setProfile({
                  ...profile,
                  date_of_birth: e.target.value,
                })
              }
              value={profile.date_of_birth || ""}
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
              value={profile.height || ""}
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
              value={profile.weight || ""}
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
          onClick={async () => {
            if (editing) {
              try {
                setLoading(true);

                const token = localStorage.getItem("token");

                await api.put("/api/profile", profile, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });

                toast.success("Profile Updated Successfully!");
              } catch (error) {
                toast.error("Update failed.");
              } finally {
                setLoading(false);
              }
            }

            setEditing(!editing);
          }}
          className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading
            ? "Saving..."
            : editing
              ? "Save Profile"
              : "Edit Profile"}
        </button>

      </div>
    </Layout>
  );
}

export default Profile;