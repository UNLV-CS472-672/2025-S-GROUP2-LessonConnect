from django.test import TestCase

# Create your tests here.
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.pomodoro.models import PomodoroSession, PetCatalog, PetCollection
from django.db.utils import IntegrityError
from django.core.exceptions import ValidationError
from django.db import transaction

User = get_user_model()

class PomodoroSessionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        
    def test_create_pomodoro_session(self):
        session = PomodoroSession.objects.create(
            student=self.user,
            duration=30,
            task_description="Study for math test",
            is_completed=False,
            pet_earned=True
        )
        self.assertEqual(session.duration, 30)
        self.assertEqual(session.task_description, "Study for math test")
        self.assertFalse(session.is_completed)
        self.assertTrue(session.pet_earned)
        self.assertIsNotNone(session.start_time)
        self.assertIsNone(session.end_time)
    
    def test_str_representation(self):
        session = PomodoroSession.objects.create(student=self.user)
        self.assertIn("Pomodoro Session", str(session))

    def test_default_values(self):
        session = PomodoroSession.objects.create(student=self.user)
        self.assertEqual(session.duration, 25)
        self.assertFalse(session.is_completed)
        self.assertFalse(session.pet_earned)
    
    def test_negative_duration(self):        
        session = PomodoroSession(student=self.user, duration=-5)
        with self.assertRaises(ValidationError):
            session.full_clean()  # This will trigger MinValueValidator(1)
        

class PetCatalogModelTest(TestCase):
    def test_create_pet_catalog(self):
        pet = PetCatalog.objects.create(
            name='Waffle',
            pet_type='Cat',
            description='Splendid, of course',
            rarity=PetCatalog.COMMON,
            drop_rate=0.5
        )
        self.assertEqual(pet.name, 'Waffle')
        self.assertEqual(pet.pet_type, 'Cat')
        self.assertEqual(pet.rarity, PetCatalog.COMMON)
        self.assertEqual(pet.drop_rate, 0.5)
    
    def test_str_representation(self):
        pet = PetCatalog.objects.create(
            name='Ruffles',
            pet_type='Chocolate lab',
            description='Just a baby',
            rarity=PetCatalog.RARE,
            drop_rate=0.3
        )
        self.assertEqual(str(pet), "Ruffles (rare)")

    def test_invalid_drop_rate(self):
        pet = PetCatalog(
            name='InvalidPet',
            pet_type='Unknown',
            description='Invalid',
            rarity=PetCatalog.COMMON,
            drop_rate=1.5  # Invalid value
        )
        with self.assertRaises(ValidationError):
            pet.full_clean()  # This will trigger the MinValueValidator and MaxValueValidator

class PetCollectionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.pet = PetCatalog.objects.create(
            name='Pharoah',
            pet_type='Shih Tzu',
            description='A legendary dog',
            rarity=PetCatalog.LEGENDARY,
            drop_rate=0.07
        )
    
    def test_create_pet_collection(self):
        collection = PetCollection.objects.create(
            student=self.user,
            pet_catalog=self.pet,
            is_active=True
        )
        self.assertEqual(collection.student, self.user)
        self.assertEqual(collection.pet_catalog, self.pet)
        self.assertTrue(collection.is_active)
        self.assertIsNotNone(collection.acquired_at)
    
    def test_str_representation(self):
        collection = PetCollection.objects.create(student=self.user, pet_catalog=self.pet)
        self.assertEqual(str(collection), "Pharoah")

    def test_duplicate_pet_collection(self):
        PetCollection.objects.create(student=self.user, pet_catalog=self.pet)
        with self.assertRaises(IntegrityError):
            with transaction.atomic():
                PetCollection.objects.create(student=self.user, pet_catalog=self.pet)
    
    def test_toggle_active_status(self):
        collection = PetCollection.objects.create(student=self.user, pet_catalog=self.pet, is_active=False)
        collection.is_active = True
        collection.save()
        self.assertTrue(PetCollection.objects.get(id=collection.id).is_active)
