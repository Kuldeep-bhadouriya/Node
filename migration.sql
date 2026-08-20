-- Drop existing Student table and recreate with new schema
DROP TABLE IF EXISTS "Student" CASCADE;

-- Create new Student table with all fields
CREATE TABLE "Student" (
  "id" TEXT NOT NULL,
  "cardNo" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "batch" TEXT NOT NULL,
  "branch" TEXT NOT NULL,
  "fathersName" TEXT NOT NULL,
  "mothersName" TEXT NOT NULL,
  "address" TEXT NOT NULL,
  "studentMobile" TEXT NOT NULL,
  "parentsMobile" TEXT NOT NULL,
  "bloodGroup" TEXT NOT NULL,
  "photoPath" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- Create unique index on cardNo
CREATE UNIQUE INDEX "Student_cardNo_key" ON "Student"("cardNo");

-- Create index on id and branch
CREATE INDEX "Student_id_idx" ON "Student"("id");
CREATE INDEX "Student_branch_idx" ON "Student"("branch");
