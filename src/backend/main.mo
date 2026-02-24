import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

actor {
  type GameType = {
    #snake;
    #ticTacToe;
    #memoryCard;
    #numberGuessing;
  };

  type GameResult = {
    playerId : Principal;
    gameType : GameType;
    score : Nat;
    timestamp : Time.Time;
  };

  type UserProfile = {
    username : Text;
    avatarUrl : Text;
    totalScore : Nat;
    gamesPlayed : Nat;
  };

  module UserProfile {
    public func compare(a : (Principal, UserProfile), b : (Principal, UserProfile)) : Order.Order {
      Nat.compare(b.1.totalScore, a.1.totalScore);
    };
  };

  let profiles = Map.empty<Principal, UserProfile>();
  let friends = Map.empty<Principal, List.List<Principal>>();
  let gameResults = List.empty<GameResult>();

  public shared ({ caller }) func registerUser(username : Text, avatarUrl : Text) : async () {
    if (profiles.containsKey(caller)) {
      Runtime.trap("User already exists");
    };
    let profile : UserProfile = {
      username;
      avatarUrl;
      totalScore = 0;
      gamesPlayed = 0;
    };
    profiles.add(caller, profile);
    friends.add(caller, List.empty<Principal>());
  };

  public query ({ caller }) func getProfile() : async UserProfile {
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile not available") };
      case (?profile) { profile };
    };
  };

  public shared ({ caller }) func addFriend(friendId : Principal) : async () {
    if (caller == friendId) {
      Runtime.trap("Cannot add yourself as a friend");
    };

    switch (profiles.get(friendId)) {
      case (null) { Runtime.trap("Requested friend does not exist") };
      case (?_) {
        switch (friends.get(caller)) {
          case (null) {
            let newFriendList = List.empty<Principal>();
            newFriendList.add(friendId);
            friends.add(caller, newFriendList);
          };
          case (?currentFriends) {
            if (not currentFriends.contains(friendId)) {
              currentFriends.add(friendId);
            };
          };
        };
      };
    };
  };

  public query ({ caller }) func getFriends() : async [Principal] {
    switch (friends.get(caller)) {
      case (null) { Runtime.trap("Friends list is not available") };
      case (?friendList) { friendList.toArray() };
    };
  };

  public shared ({ caller }) func recordGameResult(gameType : GameType, score : Nat) : async () {
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("Profile does not exist") };
      case (?profile) {
        let newResult : GameResult = {
          playerId = caller;
          gameType;
          score;
          timestamp = Time.now();
        };
        gameResults.add(newResult);

        let updatedProfile : UserProfile = {
          profile with
          totalScore = profile.totalScore + score;
          gamesPlayed = profile.gamesPlayed + 1;
        };
        profiles.add(caller, updatedProfile);
      };
    };
  };

  public query func getLeaderboard() : async [(Principal, UserProfile)] {
    profiles.toArray().sort();
  };

  public query ({ caller }) func getFriendsLeaderboard() : async [(Principal, UserProfile)] {
    let friendsList = switch (friends.get(caller)) {
      case (null) { Runtime.trap("Friends list is not available") };
      case (?friendList) { friendList };
    };

    let friendsProfiles = List.empty<(Principal, UserProfile)>();
    for (friend in friendsList.values()) {
      switch (profiles.get(friend)) {
        case (null) {};
        case (?profile) {
          friendsProfiles.add((friend, profile));
        };
      };
    };
    friendsProfiles.toArray().sort();
  };
};
