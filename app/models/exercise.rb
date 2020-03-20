class Exercise < ApplicationRecord
  belongs_to :created_by, class_name: "User"
end
