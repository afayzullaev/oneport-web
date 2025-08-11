import ProfileForm from "@/components/forms/ProfileForm";

export default function CreateProfile() {
    return (
      <div className="min-h-screen bg-gray-50">
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            padding: "50px 20px",
            textAlign: "center",
          }}
        >
          <ProfileForm />
        </div>
      </div>
    );

}
